# Database

This directory contains database schemas, migration scripts, and database-related documentation for BYCHEFIZA.

## Database Architecture

**Expected database setup** (update based on actual implementation):
- **Primary Database**: PostgreSQL 14+ (relational data)
- **Document Store**: MongoDB (flexible schemas, if used)
- **Cache Layer**: Redis (sessions, caching)
- **Message Queue**: RabbitMQ (async processing)

## Database Schema

The application uses multiple databases for different purposes:

- **PostgreSQL**: Core application data (users, products, orders, payments)
- **MongoDB**: Flexible schema data (logs, analytics, if applicable)
- **Redis**: Session storage, caching, rate limiting

## Migrations

### Location

Database migrations are stored in:
- **Service-specific migrations**: `services/<service-name>/migrations/`
- **Shared migrations** (if any): `database/migrations/`

Each microservice typically manages its own database and migrations independently.

### Running Migrations

Migrations are typically run via the service's npm scripts. Examples:

```bash
# From a service directory (e.g., services/auth-service)
npm run migrate
# or
npm run db:migrate

# Rollback migrations
npm run migrate:undo
# or
npm run db:rollback

# Check migration status
npm run migrate:status
```

### Creating Migrations

```bash
# Generate a new migration (Sequelize example)
npm run migrate:generate -- --name create-users-table

# TypeORM example
npm run typeorm migration:generate -- -n CreateUsersTable

# Prisma example
npx prisma migrate dev --name create-users-table
```

## Docker Compose Services

Example `docker-compose.yml` configuration for databases:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    container_name: bychefiza-postgres
    environment:
      POSTGRES_DB: bychefiza
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: changeme
      # For production, use secrets instead:
      # POSTGRES_PASSWORD_FILE: /run/secrets/postgres-password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d  # Initialization scripts
    networks:
      - bychefiza-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d bychefiza"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB Database
  mongodb:
    image: mongo:6
    container_name: bychefiza-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: changeme
      MONGO_INITDB_DATABASE: bychefiza
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./database/mongo-init:/docker-entrypoint-initdb.d
    networks:
      - bychefiza-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: bychefiza-redis
    command: redis-server --requirepass changeme
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - bychefiza-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # RabbitMQ Message Queue
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: bychefiza-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"   # AMQP port
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - bychefiza-network

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
  rabbitmq_data:

networks:
  bychefiza-network:
    driver: bridge
```

### Starting Databases

```bash
# Start all databases
docker-compose up -d postgres mongodb redis rabbitmq

# Start specific database
docker-compose up -d postgres

# View logs
docker-compose logs -f postgres

# Stop databases
docker-compose down

# Stop and remove volumes (WARNING: destroys data)
docker-compose down -v
```

## Backups

### PostgreSQL Backups

```bash
# Create backup
docker exec bychefiza-postgres pg_dump -U admin bychefiza > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker exec -i bychefiza-postgres psql -U admin bychefiza < backup_20240101_120000.sql

# Automated backups (add to cron)
0 2 * * * docker exec bychefiza-postgres pg_dump -U admin bychefiza | gzip > /backups/bychefiza_$(date +\%Y\%m\%d).sql.gz
```

### MongoDB Backups

```bash
# Create backup
docker exec bychefiza-mongodb mongodump --username admin --password changeme --authenticationDatabase admin --db bychefiza --out /backup

# Copy backup from container
docker cp bychefiza-mongodb:/backup ./mongodb_backup_$(date +%Y%m%d_%H%M%S)

# Restore from backup
docker exec bychefiza-mongodb mongorestore --username admin --password changeme --authenticationDatabase admin --db bychefiza /backup/bychefiza
```

### Redis Backups

```bash
# Redis automatically saves snapshots (RDB)
# Force save
docker exec bychefiza-redis redis-cli -a changeme SAVE

# Copy RDB file
docker cp bychefiza-redis:/data/dump.rdb ./redis_backup_$(date +%Y%m%d_%H%M%S).rdb
```

## Database Management Tools

### PostgreSQL

```bash
# Connect with psql
docker exec -it bychefiza-postgres psql -U admin -d bychefiza

# Common commands
\dt           # List tables
\d users      # Describe table
\l            # List databases
\c dbname     # Connect to database
\q            # Quit
```

### MongoDB

```bash
# Connect with mongosh
docker exec -it bychefiza-mongodb mongosh -u admin -p changeme --authenticationDatabase admin

# Common commands
show dbs                  # List databases
use bychefiza            # Switch database
show collections         # List collections
db.users.find()          # Query collection
exit                     # Quit
```

### Redis

```bash
# Connect with redis-cli
docker exec -it bychefiza-redis redis-cli -a changeme

# Common commands
KEYS *                   # List all keys
GET key                  # Get value
SET key value            # Set value
DEL key                  # Delete key
FLUSHDB                  # Clear current database
exit                     # Quit
```

## Migration Best Practices

1. **Always review migrations** before running in production
2. **Test migrations** on a copy of production data
3. **Make migrations reversible** - implement both `up` and `down`
4. **Backup before migrating** - especially in production
5. **Run migrations in transactions** when possible
6. **Document breaking changes** in migration comments
7. **Version control** all migration files
8. **Coordinate migrations** with code deployments

## Database Seeding (Development)

```bash
# Seed development data (example)
npm run db:seed

# Reset database and seed
npm run db:reset

# Seed specific data
npm run db:seed -- --file users.seed.js
```

## Connection Pooling

Configure connection pools in your services:

```javascript
// Example: PostgreSQL with pg pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Performance Optimization

- **Indexes**: Add indexes for frequently queried columns
- **Connection pooling**: Reuse database connections
- **Query optimization**: Use EXPLAIN to analyze slow queries
- **Caching**: Use Redis for frequently accessed data
- **Read replicas**: Scale reads with database replicas (production)

## Security Notes

- **Never commit credentials** to version control
- **Use strong passwords** for all database users
- **Limit network access** - databases should not be publicly accessible
- **Use SSL/TLS** for database connections in production
- **Regular updates** - keep database software patched
- **Audit logs** - enable and monitor database audit logs
- **Principle of least privilege** - grant minimal permissions needed

## Production Considerations

- **Managed databases**: Consider using AWS RDS, Google Cloud SQL, or Azure Database
- **High availability**: Set up primary-replica replication
- **Automated backups**: Configure automated backup schedules
- **Monitoring**: Set up alerts for disk space, connections, slow queries
- **Disaster recovery**: Test backup restoration procedures regularly

## Notes

- **Update this README**: Replace placeholders with actual database configurations
- **Document schema changes**: Keep track of major schema changes
- **Service-specific migrations**: Remember that each microservice manages its own database
- **Local vs. Production**: Use different credentials and configurations for each environment

## Troubleshooting

- **Connection refused**: Check if database container is running (`docker ps`)
- **Authentication failed**: Verify credentials in `.env` file
- **Port conflicts**: Ensure ports 5432, 27017, 6379 are available
- **Migration failures**: Check migration logs and database user permissions
- **Disk space**: Monitor database volume usage (`docker system df`)

---

**Update this README with actual database schema, migration tools, and backup procedures used in your project.**
