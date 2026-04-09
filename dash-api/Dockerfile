FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
# --reload + --reload-dir gives us hot-reload without a manual restart after
# every git pull. The bind mount defined in ash-infra/docker-compose.yml maps
# the host's metrics-dashboard-demo/dash-api/app directory onto /app/app, so
# any .py change on the host (delivered by the 5-min cron pull) triggers
# watchfiles (included via uvicorn[standard]) → uvicorn respawns the worker →
# new code live within ~1-2 seconds. Matches the pattern already proven in
# prod by fmc-api.
#
# --reload-dir is restricted to /app/app on purpose: without it uvicorn
# watches the whole WORKDIR (/app), which would also react to changes in
# /app/requirements.txt — misleading, because requirements changes need an
# image rebuild (deps are installed at build time, not mount time), so a
# reload on them would yield a worker with stale imports.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "/app/app"]
