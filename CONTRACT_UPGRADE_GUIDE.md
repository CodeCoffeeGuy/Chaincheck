# ChainCheck Contract Upgrade Guide

## Important: Contract is NOT Upgradeable

**ChainCheck contract is NOT upgradeable** - it does not use a proxy pattern (UUPS, Transparent, etc.). This means:

- **Immutable:** Contract code cannot be changed after deployment
- **Security:** No upgrade attack vectors
- **No Code Updates:** Cannot fix bugs or add features to deployed contract

---

## Upgrade Strategy

Since the contract is immutable, "upgrading" means deploying a **new contract** and migrating data.

### Option 1: Deploy New Contract (Recommended)

**When to use:**
- Need to fix critical bugs
- Want to add new features
- Security improvements needed

**Process:**
1. Deploy new contract version
2. Migrate manufacturer authorizations (use migration script)
3. Re-register products (manufacturers must do this)
4. Update frontend to use new contract address
5. Old contract remains on-chain (immutable)

**Pros:**
- Clean slate
- Can fix all issues
- Can add new features

**Cons:**
- Must re-register all products
- Verification history lost
- Users need to update frontend

---

### Option 2: Keep Old Contract (If No Critical Issues)

**When to use:**
- Contract works well
- No critical bugs
- Minor improvements can wait

**Process:**
- Keep using existing contract
- Document any limitations
- Plan for future version if needed

---

## Migration Process

### Step 1: Deploy New Contract

```bash
# Deploy new contract version
npm run deploy:prod

# Save the new contract address
# Add to .env: NEW_CONTRACT_ADDRESS=0x...
```

### Step 2: Migrate Data

Use the migration script:

```bash
# Set environment variables
OLD_CONTRACT_ADDRESS=0x... # Old contract
NEW_CONTRACT_ADDRESS=0x... # New contract

# Run migration
npx hardhat run scripts/migrate-to-new-contract.js --network polygon
```

**What gets migrated:**
- Manufacturer authorizations

**What CANNOT be migrated:**
- Product batches (must re-register)
- Verification history
- Serial number mappings

### Step 3: Re-register Products

Manufacturers must:
1. Export product data from old contract (use backup script)
2. Re-register products in new contract
3. Generate new QR codes (if contract address changed)

### Step 4: Update Frontend

```bash
# Update frontend/.env
VITE_CONTRACT_ADDRESS=0x... # New contract address
```

### Step 5: Update Documentation

- Update README.md with new contract address
- Update API.md if contract interface changed
- Notify users of the change

---

## Migration Script

**File:** `scripts/migrate-to-new-contract.js`

**What it does:**
- Reads manufacturer list from old contract
- Authorizes them in new contract
- Creates migration report

**Usage:**
```bash
# Set in .env:
OLD_CONTRACT_ADDRESS=0x...
NEW_CONTRACT_ADDRESS=0x...

# Run:
npx hardhat run scripts/migrate-to-new-contract.js --network polygon
```

---

## Migration Checklist

### Pre-Migration
- [ ] Deploy new contract
- [ ] Test new contract thoroughly
- [ ] Backup data from old contract
- [ ] Plan downtime (if needed)

### Migration
- [ ] Run migration script
- [ ] Verify manufacturer authorizations
- [ ] Re-register critical products
- [ ] Test new contract functionality

### Post-Migration
- [ ] Update frontend configuration
- [ ] Update documentation
- [ ] Notify manufacturers
- [ ] Notify users (if contract address changed)
- [ ] Monitor new contract

---

## Best Practices

### 1. Test Thoroughly Before Deploying New Version
- Test on Mumbai testnet first
- Run all tests
- Test migration script

### 2. Backup Everything
```bash
# Backup old contract data
npx hardhat run scripts/backup-data.js --network polygon
```

### 3. Communicate Changes
- Notify manufacturers in advance
- Provide migration timeline
- Document breaking changes

### 4. Gradual Migration
- Migrate manufacturers first
- Let them re-register products gradually
- Keep old contract running during transition

---

## When NOT to Upgrade

**Don't upgrade if:**
- Contract works perfectly
- No critical security issues
- Users are happy
- Migration cost > benefit

**Upgrade only if:**
- Critical security vulnerability found
- Critical bug affecting functionality
- Need essential new features
- Professional audit recommends it

---

## Alternative: Feature Flags

Instead of upgrading, consider:
- Adding features via separate contracts
- Using events for additional functionality
- Building on top of existing contract

---

## Related Scripts

- `scripts/backup-data.js` - Backup contract data
- `scripts/migrate-to-new-contract.js` - Migrate to new contract
- `scripts/benchmark-gas.js` - Compare gas costs

---

## Important Notes

1. **Old contract remains immutable** - cannot be changed
2. **Product data cannot be migrated** - must re-register
3. **Verification history is lost** - starts fresh in new contract
4. **Users may need to update** - if contract address changes
5. **Migration costs gas** - for each authorization

---

## Resources

- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/upgrades-plugins/1.x/)
- [Proxy Patterns](https://docs.openzeppelin.com/contracts/4.x/api/proxy)
- [Contract Migration Best Practices](https://ethereum.org/en/developers/docs/smart-contracts/upgrading/)

---

**Last Updated:** 2024-11-08




