from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    connection: str                         # "zbt", "fmc", etc.
    table: str                              # "analytics.signals" (schema.table)
    action: str = "data"                    # "schema" | "distinct" | "data"
    column: str | None = None               # for distinct action
    filters: dict[str, list] = {}           # {"col": ["val1", "val2"]}
    group_by: list[str] = []
    metrics: list[dict] = []                # [{"type":"count","alias":"vol"}, ...]
    time_grain: str | None = None           # day/week/month/quarter/year
    date_column: str | None = None
    order_by: str | None = None
    limit: int = Field(default=10000, ge=1, le=50000)
    top_n: int | None = Field(default=None, ge=1, le=100)
    rank_by: str | None = None
    date_from: str | None = None            # inclusive YYYY-MM-DD lower bound on date_column
    date_to: str | None = None              # inclusive YYYY-MM-DD upper bound on date_column
