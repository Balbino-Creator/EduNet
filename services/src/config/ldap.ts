import ldap from "ldapjs";

const ldapClient = ldap.createClient({
    url: process.env.LDAP_URL,
    reconnect: true,
    tlsOptions: { rejectUnauthorized: false } // Avoid problems with LDAPS
});

export default ldapClient;
