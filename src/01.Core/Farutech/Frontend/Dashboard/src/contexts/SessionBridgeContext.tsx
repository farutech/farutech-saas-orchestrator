import React, { createContext, useContext } from 'react';

interface SessionBridgeContextType {
	getSessionForInstance: (orgCode: string, instanceSegment: string) => Promise<any>;
	validateInstanceAccess: (orgCode: string, instanceSegment: string) => Promise<boolean>;
}

const SessionBridgeContext = createContext<SessionBridgeContextType | null>(null);

export const SessionBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const validateInstanceAccess = async (orgCode: string, instanceSegment: string) => {
		const cacheKey = `access_${orgCode}_${instanceSegment}`;
		const cached = sessionStorage.getItem(cacheKey);
		if (cached) return JSON.parse(cached);

		try {
			const res = await fetch('/api/validate-instance-access', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ orgCode, instanceSegment })
			});
			if (!res.ok) return false;
			const data = await res.json();
			const hasAccess = !!data.hasAccess;
			sessionStorage.setItem(cacheKey, JSON.stringify(hasAccess));
			return hasAccess;
		} catch (e) {
			console.error('validateInstanceAccess error', e);
			return false;
		}
	};

	const generateInstanceToken = async (payload: any) => {
		try {
			const res = await fetch('/api/generate-instance-token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) throw new Error('token generation failed');
			const data = await res.json();
			return data.instanceToken;
		} catch (e) {
			console.error('generateInstanceToken error', e);
			return null;
		}
	};

	const getSessionForInstance = async (orgCode: string, instanceSegment: string) => {
		const hasAccess = await validateInstanceAccess(orgCode, instanceSegment);
		if (!hasAccess) throw new Error('Access denied to this instance');

		const authToken = localStorage.getItem('auth_token');
		const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

		const instanceToken = await generateInstanceToken({
			userId: userData?.id,
			tenantId: orgCode,
			instanceId: instanceSegment,
			permissions: userData?.permissions
		});

		return {
			instanceToken,
			user: userData,
			expiresIn: 3600
		};
	};

	return (
		<SessionBridgeContext.Provider value={{ getSessionForInstance, validateInstanceAccess }}>
			{children}
		</SessionBridgeContext.Provider>
	);
};

export const useSessionBridge = (): SessionBridgeContextType => {
	const ctx = useContext(SessionBridgeContext);
	if (!ctx) throw new Error('useSessionBridge must be used within SessionBridgeProvider');
	return ctx;
};

export default SessionBridgeContext;

