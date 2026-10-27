from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import utcnow


class HygieneAudit(Base):
    __tablename__ = "hygiene_audits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    media_url = Column(String(500), nullable=True)
    media_type = Column(String(50), default="image")  # "image" or "video"
    frames_analyzed = Column(Integer, default=1)
    
    overall_score = Column(Float, default=85.0)  # 0 to 100
    cleanliness_rating = Column(String(50), default="Good")  # Excellent, Good, Fair, Needs Immediate Action
    contamination_risk = Column(String(50), default="Low")   # Low, Moderate, High, Severe
    
    surface_cleanliness = Column(JSON, default=dict)
    cross_contamination_risks = Column(JSON, default=list)
    storage_compliance = Column(JSON, default=dict)
    detected_hazards = Column(JSON, default=list)  # [{'timestamp': '00:03', 'hazard': '...', 'severity': '...'}]
    corrective_actions = Column(JSON, default=list)
    disclaimer = Column(Text, nullable=False)
    
    created_at = Column(DateTime, default=utcnow, nullable=False)

    user = relationship("User", back_populates="hygiene_audits")
