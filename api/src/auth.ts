const CAS_LOGIN_URL = 'https://cas.finki.ukim.mk/cas/login';
const DIPLOMAS_LOGIN_URL = 'http://diplomski.finki.ukim.mk/Account/LoginCAS';
const DIPLOMAS_LIST_URL = 'https://diplomski.finki.ukim.mk/DiplomaList';

const collectCookies = (response: Response, existing: string[]): string[] => {
  const all = [...existing];
  const setCookieHeaders = (
    response.headers as unknown as { getSetCookie: () => string[] }
  ).getSetCookie();

  for (const header of setCookieHeaders) {
    const cookie = header.split(';')[0];

    if (cookie) {
      all.push(cookie);
    }
  }

  return all;
};

const mergeCookieHeader = (cookies: string[]): string => cookies.join('; ');

const parseHiddenInputs = (html: string): URLSearchParams => {
  const params = new URLSearchParams();
  const inputRegex = /<input[^>]*type=["']hidden["'][^>]*>/giu;
  let match;

  while ((match = inputRegex.exec(html)) !== null) {
    const tag = match[0];
    const nameMatch = /name=["'](?<name>[^"']*)["']/iu.exec(tag);
    const valueMatch = /value=["'](?<value>[^"']*)["']/iu.exec(tag);

    if (nameMatch?.groups?.name) {
      params.append(nameMatch.groups.name, valueMatch?.groups?.value ?? '');
    }
  }

  return params;
};

export const authenticateAndFetch = async (
  username: string,
  password: string,
): Promise<string> => {
  let cookies: string[] = [];

  const loginPageUrl = `${CAS_LOGIN_URL}?service=${encodeURIComponent(DIPLOMAS_LOGIN_URL)}`;

  // Step 1: GET the CAS login page
  const loginPageResponse = await fetch(loginPageUrl, {
    redirect: 'manual',
  });

  cookies = collectCookies(loginPageResponse, cookies);
  const loginPageHtml = await loginPageResponse.text();

  // Step 2: POST credentials to the CAS login form
  const formParams = parseHiddenInputs(loginPageHtml);
  formParams.append('username', username);
  formParams.append('password', password);
  formParams.append('submit', 'LOGIN');

  const postResponse = await fetch(loginPageUrl, {
    body: formParams.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: mergeCookieHeader(cookies),
    },
    method: 'POST',
    redirect: 'manual',
  });

  cookies = collectCookies(postResponse, cookies);

  // Step 3: Follow redirects manually to collect cookies
  let redirectUrl = postResponse.headers.get('location');
  let lastUrl = loginPageUrl;

  while (redirectUrl) {
    const absoluteUrl = redirectUrl.startsWith('http')
      ? redirectUrl
      : new URL(redirectUrl, lastUrl).href;

    const redirectResponse = await fetch(absoluteUrl, {
      headers: {
        Cookie: mergeCookieHeader(cookies),
      },
      redirect: 'manual',
    });

    cookies = collectCookies(redirectResponse, cookies);
    lastUrl = absoluteUrl;
    redirectUrl = redirectResponse.headers.get('location');
  }

  // Step 4: Fetch the authenticated diploma list
  const diplomaResponse = await fetch(DIPLOMAS_LIST_URL, {
    headers: {
      Cookie: mergeCookieHeader(cookies),
    },
  });

  return diplomaResponse.text();
};
