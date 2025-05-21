# CRUD for Meta
from app.crud.base import CRUDBase
from app.models.goal import Meta
from app.schemas.goal import MetaCreate, MetaUpdate

class CRUDMeta(CRUDBase[Meta, MetaCreate, MetaUpdate]):
    pass

meta = CRUDMeta(Meta)
