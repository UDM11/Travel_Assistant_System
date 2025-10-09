import pytest
from app.tools.costs import estimate_cost

def test_estimate_cost():
    flights=[{"price":400},{"price":320}]
    hotel={"price_total":450}
    out=estimate_cost(flights, hotel, daily_spend=50, days=5)
    assert out["flight_min"]==320
    assert out["lodging"]==450
    assert out["misc"]==250
    assert out["total"]==1020
