# Security notes

- Never commit passwords, OAuth secrets, AI API keys, database credentials, or encryption keys.
- Keep production secrets in the hosting provider's secret/environment-variable store.
- Admin authorization is server-side and should remain restricted to the configured administrator.
- High Alert data is sensitive. Do not expose it to public users.
- Before production launch, add persistent rate limiting, abuse monitoring, audit logs, backups, retention/deletion controls, and a security review.
- Emergency-service numbers must be verified per country before being displayed.
- Do not claim an authority was contacted unless an official integration actually completed the action.
