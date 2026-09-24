from fastapi import FastAPI
from app.api.routes.forecast import router as forecast_router
from app.api.routes.optimization import router as optimization_router


app = FastAPI(
    title="Health Supply Chain ML Service",
    version="1.0.0",
)

app.include_router(forecast_router)
app.include_router(optimization_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}