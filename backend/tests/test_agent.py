from fastapi.testclient import TestClient
from app.api import app

client = TestClient(app)

def test_plan_minimal(monkeypatch):
    def fake_plan_sync(q): return {"markdown":"ok","tools":{}}
    from app.agents import crew
    monkeypatch.setattr(crew, "plan_trip_sync", fake_plan_sync)
    r = client.post("/plan", json={
        "origin":"KTM","destination":"DEL","start_date":"2025-09-20","days":3,"budget_per_day":50,"preferences":[]
    })
    assert r.status_code==200
    assert r.json()["markdown"]=="ok"
