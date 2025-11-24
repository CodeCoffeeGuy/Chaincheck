# Monitoring Setup Guide

This guide explains how to set up monitoring for ChainCheck in production.

---

## Monitoring Services

### 1. Error Tracking - Sentry

**Status:** Integrated

**Setup:**
1. Create a Sentry account at https://sentry.io
2. Create a new project (React)
3. Copy your DSN
4. Add to `frontend/.env`:
 ```bash
 VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
 ```

**Features:**
- Automatic error capture
- Performance monitoring (10% sampling in production)
- Session replay on errors
- User context tracking
- Release tracking

**What's Tracked:**
- React component errors
- Unhandled exceptions
- Network errors (filtered)
- User rejections (filtered out)

**Dashboard:** https://sentry.io/organizations/your-org/projects/

---

### 2. Analytics - PostHog

**Status:** Integrated

**Setup:**
1. Create account at https://posthog.com
2. Create a new project
3. Get your API key (phc_...)
4. Add to `frontend/.env`:
 ```bash
 VITE_POSTHOG_KEY=phc_your_api_key_here
 # Optional: If self-hosting PostHog
 # VITE_POSTHOG_HOST=https://your-posthog-instance.com
 ```

**What's Tracked:**
- Page views (automatic)
- QR code scans
- Product verifications (authentic/counterfeit)
- Wallet connections
- Errors
- Session recordings (optional, configurable)

**Features:**
- Automatic event capture
- Session replay
- User identification
- Feature flags support
- Privacy-focused (GDPR-ready)
- Open source (can self-host)

**Dashboard:** https://app.posthog.com/

**Self-Hosting:**
PostHog can be self-hosted for complete data control. See: https://posthog.com/docs/self-host

---

### 3. Uptime Monitoring

**Recommended Services:**
- **UptimeRobot** (Free tier: 50 monitors)
- **Pingdom** (Paid)
- **StatusCake** (Free tier available)

**Setup for UptimeRobot:**
1. Sign up at https://uptimerobot.com
2. Add monitors for:
 - Frontend: `https://chaincheck.io`
 - QR Generator: `https://qr.chaincheck.io/health`
 - Contract RPC: Test Polygon RPC endpoint
3. Set alert contacts (email, Slack, etc.)

**Recommended Checks:**
- Frontend: HTTP check every 5 minutes
- QR Generator: HTTP check every 5 minutes
- Health endpoint: Check `/health` returns 200

---

### 4. Blockchain Monitoring

**Recommended Services:**
- **Tenderly** - Transaction monitoring and debugging
- **Alchemy Notify** - Event monitoring
- **The Graph** - Indexed blockchain data

**Setup for Tenderly:**
1. Sign up at https://tenderly.co
2. Add your contract address
3. Set up alerts for:
 - Failed transactions
 - Unusual activity
 - High gas usage

**Setup for Alchemy Notify:**
1. Use Alchemy as your RPC provider
2. Set up webhooks for contract events
3. Monitor:
 - `ProductRegistered` events
 - `Verified` events
 - `ManufacturerAuthorized` events

---

### 5. Performance Monitoring

**Frontend Performance:**
- **Sentry Performance** - Already integrated (10% sampling)
- **Google Analytics Core Web Vitals** - Automatic
- **Lighthouse CI** - Add to CI/CD pipeline

**Backend Performance:**
- **QR Generator Logs** - Use hosting provider logs
- **Response time monitoring** - Via uptime monitoring

---

## Alert Configuration

### Critical Alerts (Immediate Response)

1. **Frontend Down**
 - Service: UptimeRobot
 - Threshold: 2 consecutive failures
 - Notification: Email + Slack

2. **High Error Rate**
 - Service: Sentry
 - Threshold: >10 errors/hour
 - Notification: Email + Slack

3. **Contract Paused**
 - Service: Tenderly/Alchemy
 - Threshold: Pause event detected
 - Notification: Immediate alert

### Warning Alerts (Monitor)

1. **QR Generator Slow Response**
 - Threshold: >2s response time
 - Notification: Email

2. **High Counterfeit Rate**
 - Service: Analytics
 - Threshold: >20% counterfeit rate
 - Notification: Daily digest

3. **Low Verification Volume**
 - Service: Analytics
 - Threshold: <10 verifications/day
 - Notification: Weekly report

---

## Key Metrics to Monitor

### Business Metrics
- Total verifications per day
- Authentic vs counterfeit ratio
- Active users
- Products registered
- Verification success rate

### Technical Metrics
- Frontend uptime (target: 99.9%)
- Error rate (target: <0.1%)
- Average response time (target: <2s)
- Transaction success rate (target: >99%)
- Gas costs

### Security Metrics
- Failed transaction attempts
- Unusual verification patterns
- Rate limit hits
- Suspicious activity

---

## Monitoring Tools Setup

### Sentry Dashboard
1. Go to https://sentry.io
2. Navigate to your project
3. Set up alerts:
 - Error rate spikes
 - New error types
 - Performance degradation

### Google Analytics Dashboard
1. Go to https://analytics.google.com
2. Create custom reports:
 - Verification funnel
 - User journey
 - Error tracking

### UptimeRobot Dashboard
1. Go to https://uptimerobot.com
2. Configure monitors
3. Set up status page (optional)

---

## Monitoring Checklist

### Daily
- [ ] Check Sentry for new errors
- [ ] Review error rate trends
- [ ] Check uptime status

### Weekly
- [ ] Review analytics reports
- [ ] Check performance metrics
- [ ] Review security alerts

### Monthly
- [ ] Review business metrics
- [ ] Analyze user behavior
- [ ] Optimize based on data

---

## Quick Links

- **Sentry:** https://sentry.io
- **Google Analytics:** https://analytics.google.com
- **UptimeRobot:** https://uptimerobot.com
- **Tenderly:** https://tenderly.co
- **Alchemy:** https://alchemy.com

---

## Incident Response

### When an Alert Fires:

1. **Assess Severity**
 - Critical: Service down, high error rate
 - Warning: Performance degradation, unusual activity

2. **Check Status**
 - Frontend: https://chaincheck.io
 - QR Generator: Check `/health` endpoint
 - Blockchain: Check Polygon network status

3. **Investigate**
 - Check Sentry for error details
 - Review recent deployments
 - Check logs

4. **Respond**
 - Fix critical issues immediately
 - Document incident
 - Update status page

5. **Post-Mortem**
 - Review what happened
 - Identify root cause
 - Implement prevention measures

---

## Example Monitoring Dashboard

Create a dashboard with:
- Uptime percentage
- Error rate graph
- Verification volume
- Response time
- Active users
- Top errors

**Tools:**
- Grafana (self-hosted)
- Datadog (paid)
- Custom dashboard using APIs

---

**Last Updated:** 2024-11-08

