
openssl pkcs12 -in *.p12 -out public.pem -clcerts -nokeys
openssl pkcs12 -in *.p12 -out private.pem -nocerts -nodes
