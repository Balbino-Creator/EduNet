import ldap from "ldapjs";

export function getLdapClient() {
  const url = process.env.LDAP_URL;
  if (!url) {
    throw new Error("LDAP_URL is not defined in environment variables");
  }
  return ldap.createClient({
    url,
    timeout: 5000,
    connectTimeout: 5000,
  });
}
