export class UrlBuilder {
  private baseUrl: string;
  private params: Record<string, string> = {};

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  addParam(key: string, value: string): UrlBuilder {
    this.params[key] = value;
    return this;
  }

  addParams(params: Record<string, string>): UrlBuilder {
    Object.assign(this.params, params);
    return this;
  }

  build(): string {
    const url = new URL(this.baseUrl);
    Object.entries(this.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }
}

export const createUrl = (baseUrl: string) => new UrlBuilder(baseUrl);