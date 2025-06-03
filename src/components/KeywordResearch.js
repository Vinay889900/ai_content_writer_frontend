// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   List,
//   ListItem,
//   CircularProgress,
//   Divider,
// } from "@mui/material";

// const KeywordResearch = () => {
//   const [keyword, setKeyword] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedKeyword, setSelectedKeyword] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [contentLoading, setContentLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleKeywordGenerate = async () => {
//     if (!keyword.trim()) return;
//     setLoading(true);
//     setError("");
//     setSuggestions([]);
//     setSelectedKeyword("");
//     setContent("");

//     try {
//       const response = await fetch("/api/keyword", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ keyword }),
//       });

//       if (!response.ok) throw new Error("API request failed");
//       const data = await response.json();
//       setSuggestions(data.keywords || []);
//     } catch (err) {
//       setError("Failed to fetch keyword suggestions.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateContent = async (kw) => {
//     setSelectedKeyword(kw);
//     setContent("");
//     setContentLoading(true);
//     try {
//       const res = await fetch("/api/generate-content", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ keyword: kw }),
//       });
//       if (!res.ok) throw new Error("Content generation failed");
//       const data = await res.json();
//       setContent(data.content || "");
//     } catch (err) {
//       setError("Failed to generate content.");
//     } finally {
//       setContentLoading(false);
//     }
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h5" gutterBottom>
//         Keyword Research Tool
//       </Typography>

//       <TextField
//         label="Enter a seed keyword"
//         variant="outlined"
//         fullWidth
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleKeywordGenerate}
//         disabled={loading}
//       >
//         Generate Keywords
//       </Button>

//       {loading && <CircularProgress sx={{ mt: 2 }} />}
//       {error && (
//         <Typography color="error" sx={{ mt: 2 }}>
//           {error}
//         </Typography>
//       )}

//       {suggestions.length > 0 && (
//         <Box mt={4}>
//           <Typography variant="h6">Suggested Keywords:</Typography>
//           <List>
//             {suggestions.map((item, index) => (
//               <ListItem
//                 button
//                 key={index}
//                 onClick={() => handleGenerateContent(item)}
//                 selected={item === selectedKeyword}
//               >
//                 {item}
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       )}

//       {selectedKeyword && (
//         <Box mt={4}>
//           <Divider sx={{ mb: 2 }} />
//           <Typography variant="h6">
//             Generated Content for: <strong>{selectedKeyword}</strong>
//           </Typography>
//           {contentLoading ? (
//             <CircularProgress sx={{ mt: 2 }} />
//           ) : (
//             <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-line" }}>
//               {content}
//             </Typography>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default KeywordResearch;
