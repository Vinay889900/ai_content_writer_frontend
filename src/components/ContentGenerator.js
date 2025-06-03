import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

const ContentGenerator = ({ activeStep, setActiveStep }) => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const [history, setHistory] = useState([]);
  const [seoScore, setSeoScore] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [keywordsResult, setKeywordsResult] = useState([]);

  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [titlesResult, setTitlesResult] = useState([]);

  const [selectedTitle, setSelectedTitle] = useState("");
  const [topicsResult, setTopicsResult] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset all downstream states when keyword changes
  useEffect(() => {
    if (activeStep === 0) {
      setSelectedKeyword("");
      setTitlesResult([]);
      setSelectedTitle("");
      setTopicsResult([]);
      setSelectedTopic("");
      setContent("");
      setSeoScore(null);
      setError("");
    }
  }, [keyword, activeStep]);

  // Move step when selecting keywords, titles, topics, content
  const goToStep = (stepIndex) => setActiveStep(stepIndex);

  const handleKeywordSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/keyword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const kws = data.result.split("\n").filter(Boolean);
      setKeywordsResult(kws);
      // Reset downstream selections
      setTitlesResult([]);
      setTopicsResult([]);
      setContent("");
      setSelectedKeyword("");
      setSelectedTitle("");
      setSelectedTopic("");
      goToStep(1); // Step 1: Select Keyword
    } catch (err) {
      setError("Failed to generate keywords. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleGenerate = async (kw) => {
    try {
      setError("");
      setSelectedKeyword(kw);
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const titles = data.result.split("\n").filter(Boolean);
      setTitlesResult(titles);
      setTopicsResult([]);
      setContent("");
      setSelectedTitle("");
      setSelectedTopic("");
      goToStep(2); // Step 2: Select Title
    } catch (err) {
      setError("Failed to generate titles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicGenerate = async (title) => {
    try {
      setError("");
      setSelectedTitle(title);
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/topic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const topics = data.result.split("\n").filter(Boolean);
      setTopicsResult(topics);
      setContent("");
      setSelectedTopic("");
      goToStep(3); // Step 3: Select Topic
    } catch (err) {
      setError("Failed to generate topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContentGenerate = async (topic) => {
    try {
      setError("");
      setSelectedTopic(topic);
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setContent(data.content);
      setSeoScore(data.seoScore);

      setHistory((prev) => [
        ...prev,
        {
          keyword,
          selectedKeyword,
          selectedTitle,
          topic,
          content: data.content,
          score: data.seoScore,
        },
      ]);
      goToStep(4); // Step 4: Generated Content
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "content.txt";
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <Box>
      {/* Step 0: Enter Keyword */}
      {activeStep === 0 && (
        <>
          <TextField
            label="Enter Seed Keyword"
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            margin="normal"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && keyword.trim()) handleKeywordSubmit();
            }}
          />
          <Button
            variant="contained"
            onClick={handleKeywordSubmit}
            disabled={loading || !keyword.trim()}
            sx={{ mt: 1 }}
          >
            Generate Keywords
          </Button>
        </>
      )}

      {/* Step 1: Select Keyword */}
      {activeStep === 1 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Step 1: Select a Keyword
          </Typography>
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {keywordsResult.map((kw, idx) => (
              <Button
                key={idx}
                onClick={() => handleTitleGenerate(kw)}
                variant={kw === selectedKeyword ? "contained" : "outlined"}
                disabled={loading}
              >
                {kw}
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* Step 2: Select Title */}
      {activeStep === 2 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Step 2: Select a Title
          </Typography>
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {titlesResult.map((t, idx) => (
              <Button
                key={idx}
                onClick={() => handleTopicGenerate(t)}
                variant={t === selectedTitle ? "contained" : "outlined"}
                disabled={loading}
              >
                {t}
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* Step 3: Select Topic */}
      {activeStep === 3 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Step 3: Select a Topic
          </Typography>
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {topicsResult.map((tp, idx) => (
              <Button
                key={idx}
                onClick={() => handleContentGenerate(tp)}
                variant={tp === selectedTopic ? "contained" : "outlined"}
                disabled={loading}
              >
                {tp}
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* Step 4: Show Content */}
      {activeStep === 4 && content && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Generated Content
          </Typography>
          <Paper elevation={3} sx={{ p: 2, whiteSpace: "pre-line" }}>
            {content}
          </Paper>
          <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
            SEO Score: {seoScore}/100
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              onClick={handleCopy}
              variant="outlined"
              disabled={loading}
            >
              Copy
            </Button>
            <Button
              onClick={handleExport}
              variant="contained"
              disabled={loading}
            >
              Export
            </Button>
          </Stack>
        </Box>
      )}

      {/* Loading & Error */}
      {loading && (
        <Box my={2} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* History */}
      {history.length > 0 && (
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            🕓 Generation History
          </Typography>
          {history.map((item, idx) => (
            <Paper key={idx} elevation={1} sx={{ p: 2, mb: 1 }}>
              <strong>Topic:</strong> {item.topic}
              <br />
              <strong>SEO Score:</strong> {item.score}
              <br />
              <strong>Preview:</strong>{" "}
              {item.content ? item.content.slice(0, 80) + "..." : "No content"}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ContentGenerator;