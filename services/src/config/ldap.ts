import ldap from "ldapjs";

const ldapClient = ldap.createClient({
  url: process.env.LDAP_URL,
  timeout: 5000, // 5 seconds
  connectTimeout: 5000
})

export default ldapClient;
