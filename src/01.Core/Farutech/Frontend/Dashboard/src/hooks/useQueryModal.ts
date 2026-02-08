import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook to manage modal state using URL query parameters.
 * @returns Object containing methods to open, close, and check modal state.
 */
export function useQueryModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Opens a modal by setting the 'modal' query parameter.
   * @param modalName The unique name of the modal to open.
   * @param params Optional additional parameters to store in the URL.
   */
  const open = useCallback((modalName: string, params?: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('modal', modalName);
    
    // Set additional params if provided
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        newParams.set(key, value);
      });
    }
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  /**
   * Closes the currently open modal by removing the 'modal' query parameter.
   * Also cleans up any associated parameters if needed (optional implementation).
   */
  const close = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('modal');
    // Optionally we could verify which params belong to the modal and remove them
    // For now, we just close the modal.
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  /**
   * Checks if a specific modal is currently open.
   * @param modalName The name of the modal to check.
   * @returns True if the modal is open, false otherwise.
   */
  const isOpen = useCallback((modalName: string) => {
    return searchParams.get('modal') === modalName;
  }, [searchParams]);

  /**
   * Retrieves the value of a specific query parameter.
   * @param key The parameter key.
   * @returns The value or null.
   */
  const getParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  return {
    open,
    close,
    isOpen,
    getParam
  };
}
