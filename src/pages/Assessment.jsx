import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
	"How interested are you in solving complex logic puzzles?",
	"Do you enjoy working with data and statistics?",
	"How do you feel about designing user interfaces?",
	"Are you interested in managing teams and projects?",
	"Do you enjoy writing technical documentation?",
	"Do you like researching and learning new technologies?",
	"Are you comfortable debugging complex systems?",
	"Do you enjoy mentoring or teaching others?",
	"How interested are you in system architecture and design?",
	"Do you like working directly with customers or stakeholders?",
];

const options = ["Very Interested", "Interested", "Neutral", "Not Interested"];

export default function Assessment() {
	const navigate = useNavigate();
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState(Array(questions.length).fill(null));

	function handleSelect(optionIdx) {
		const next = [...answers];
		next[index] = optionIdx;
		setAnswers(next);
	}

	function handleNext() {
		if (index < questions.length - 1) {
			setIndex(index + 1);
		} else {
			// finished - save answers and navigate to recommendation
			try {
				const payload = { answers };
				localStorage.setItem('assessmentAnswers', JSON.stringify(payload));
			} catch (e) {
				// ignore storage errors
			}
			navigate('/recommendation', { state: { answers } });
		}
	}

	function handleBack() {
		if (index > 0) setIndex(index - 1);
		else navigate(-1);
	}

	const selected = answers[index];

	return (
		<div style={{ padding: 0, fontFamily: "sans-serif" }}>
			<header style={{ background: "linear-gradient(90deg,#4b6bf6,#8a3fe8)", color: "white", padding: "14px 12px", display: "flex", alignItems: "center" }}>
				<button aria-label="back" onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", fontSize: 20, marginRight: 12 }}>&larr;</button>
				<h2 style={{ margin: 0 }}>Career Assessment</h2>
			</header>

			<main style={{ padding: 16 }}>
				<div style={{ color: "#6b21a8", marginBottom: 8 }}>Question {index + 1} of {questions.length}</div>

				<div style={{ height: 8, background: "#e6e6e6", borderRadius: 8, marginBottom: 18 }}>
					<div style={{ width: `${((index + 1) / questions.length) * 100}%`, height: 8, background: "#7b2cbf", borderRadius: 8 }} />
				</div>

				<div style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", marginBottom: 18 }}>
					<h3 style={{ margin: 0 }}>{questions[index]}</h3>
				</div>

				<div>
					{options.map((opt, i) => {
						const isSelected = selected === i;
						return (
							<button key={i} onClick={() => handleSelect(i)} style={{
								display: "block",
								width: "100%",
								textAlign: "left",
								padding: "18px",
								marginBottom: 12,
								borderRadius: 10,
								border: isSelected ? "2px solid #7b2cbf" : "1px solid #ddd",
								background: isSelected ? "#f6eefc" : "white",
								cursor: "pointer"
							}}>{opt}</button>
						);
					})}
				</div>

				<div style={{ display: "flex", gap: 12, marginTop: 20 }}>
					<button onClick={handleBack} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1px solid #ccc", background: "white" }}>
						{index > 0 ? "Back" : "Cancel"}
					</button>

					<button onClick={handleNext} disabled={selected === null} style={{ flex: 1, padding: "14px", borderRadius: 12, background: selected === null ? "#ddd" : "#7b2cbf", color: "white", border: "none" }}>
						{index < questions.length - 1 ? "Next Question" : "Finish"}
					</button>
				</div>
			</main>
		</div>
	);
}

