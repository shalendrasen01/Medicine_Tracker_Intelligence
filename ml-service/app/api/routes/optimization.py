from fastapi import APIRouter
from app.services.optimizer import optimize_redistribution

router = APIRouter()


@router.post("/optimize")
def optimize(request: dict):
    result = optimize_redistribution(
        request["sources"],
        request["destinations"],
        request["distances"],
    )

    return {
        "redistribution_plan": result
    }