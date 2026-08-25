import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from groq import Groq
from app.core.config import settings
from app.core.logging import logger

router = APIRouter()

HALLUCINATION_BLOCKLIST = [
    "MBC 뉴스",
    "김성현입니다",
    "시청해 주셔서 감사합니다",
    "구독과 좋아요",
    "MBC 뉴스 김성현입니다",
    "음성 명령 전사",
    "음성 명령",
    "전사입니다"
]

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Upload an audio file (e.g., wav, webm) and transcribe it to text using Groq Whisper.
    Uses the free 'whisper-large-v3' model.
    """
    if not settings.GROQ_API_KEY:
        logger.error("[AUDIO] GROQ_API_KEY is not configured in settings")
        raise HTTPException(
            status_code=500, 
            detail="GROQ_API_KEY가 서버에 설정되지 않았습니다. .env 파일을 확인해 주세요."
        )

    tmp_file_path = None
    try:
        # Determine the file suffix from the incoming filename
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".wav"
        if not suffix:
            suffix = ".wav"

        # Save uploaded file content to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            content = await file.read()
            print(f"[AUDIO BACKEND] File Received. Name: {file.filename} | Size: {len(content)} bytes | Content-Type: {file.content_type}")
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        logger.info(f"[AUDIO] Temporary audio file created: {tmp_file_path}")

        # Initialize Groq client
        client = Groq(api_key=settings.GROQ_API_KEY)

        # Execute transcription with whisper-large-v3
        with open(tmp_file_path, "rb") as audio_file:
            logger.info(f"[AUDIO] Sending transcription request for model: whisper-large-v3")
            translation = client.audio.transcriptions.create(
                file=(file.filename or tmp_file_path, audio_file.read()),
                model="whisper-large-v3",
                temperature=0.0,
                response_format="json",
                language="ko"
            )

        # Cleanup temporary file
        try:
            os.unlink(tmp_file_path)
            logger.info(f"[AUDIO] Temporary audio file cleaned up: {tmp_file_path}")
        except Exception as e:
            logger.warning(f"[AUDIO] Failed to delete temporary file {tmp_file_path}: {e}")

        transcribed_text = (translation.text or "").strip()
        
        # Whisper 환각 문장 블랙리스트 필터링
        if any(block_phrase in transcribed_text for block_phrase in HALLUCINATION_BLOCKLIST):
            print(f"🚫 [Whisper Hallucination Filtered]: '{transcribed_text}' -> Set to empty string")
            transcribed_text = ""
            
        print(f"[AUDIO BACKEND] Groq API Response Text (filtered): '{transcribed_text}'")
        logger.info(f"[AUDIO] Transcription success: '{transcribed_text}'")
        return {"text": transcribed_text}

    except Exception as e:
        logger.error(f"[AUDIO] Error transcribing audio: {e}")
        if tmp_file_path and os.path.exists(tmp_file_path):
            try:
                os.unlink(tmp_file_path)
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=f"음성 인식 처리 중 오류가 발생했습니다: {str(e)}")
