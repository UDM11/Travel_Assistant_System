from fastapi import FastAPI
from pydantic import BaseModel
from .agents import plan_trip


app = FastAPI(
    title = "Trabel Assistant Agent"
)


class TripRequest(BaseModel):
    user_input: str


@app.post("/plan-trip")
def create_trip(request: TripRequest):
    result = plan_trip(request.user_input)
    return {"result": result}