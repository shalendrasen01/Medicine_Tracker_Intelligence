from fastapi import FastAPI

from app.api.routes.forecast import router as forecast_router


app = FastAPI(
    title="Health Supply Chain ML Service",
    version="1.0.0",
)

app.include_router(forecast_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}