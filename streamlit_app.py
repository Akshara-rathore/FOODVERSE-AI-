
import streamlit as st
import requests
import os

st.set_page_config(
    page_title="FoodVerse AI",
    page_icon="🥗",
    layout="wide"
)

st.title("🥗 FoodVerse AI")
st.subheader("Your AI-powered food and nutrition assistant")

st.write(
    "Explore food nutrition, freshness, hygiene, recipes, "
    "and personalized meal planning."
)

# Backend URL: configure this in Streamlit Secrets after deployment.
API_URL = st.secrets.get(
    "API_URL",
    os.getenv("API_URL", "http://localhost:8000")
)

st.sidebar.header("Backend Status")

if st.sidebar.button("Check Backend"):
    try:
        response = requests.get(f"{API_URL}/health", timeout=10)
        if response.ok:
            st.sidebar.success("Backend connected!")
            st.sidebar.json(response.json())
        else:
            st.sidebar.warning(f"Backend returned: {response.status_code}")
    except requests.RequestException:
        st.sidebar.error("Backend unavailable. Check API_URL.")

st.info(
    "This is the Streamlit deployment interface. "
    "Your existing React frontend remains unchanged."
)
