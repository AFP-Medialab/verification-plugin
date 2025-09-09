// Example test message to verify parsing functionality
export const testMessage = `
Based on my analysis as a factchecker working in an international news agency, I have reviewed the article you provided.

<think>
Let me think through this step by step:

1. First, I need to identify any obvious biases in the language used
2. Look for one-sided reporting or missing perspectives
3. Check for propaganda techniques like emotional manipulation
4. Examine the source credibility and factual accuracy

The article seems to use several loaded terms that suggest bias. I should quote specific examples to support my assessment.
</think>

## Analysis Results

The article shows **several concerning signs** of bias and one-sided reporting:

### Bias Indicators:
- **Loaded language**: The use of terms like "controversial statement" without providing context
- **Missing perspectives**: Only one side of the issue is presented
- **Emotional appeals**: The article uses language designed to provoke an emotional response

<think>
I should be careful to provide specific quotes from the article to support these claims. The user specifically asked for justification by quoting sentences.
</think>

### Specific Examples:
The following sentences demonstrate bias:

1. *"Local politician makes controversial statement"* - The word "controversial" is loaded and subjective
2. *"Citizens are outraged"* - This generalizes without providing evidence of widespread outrage

### Conclusion:
This article exhibits characteristics of **biased reporting** rather than balanced journalism. It lacks objectivity and fails to present multiple perspectives on the issue.
`;

// Example of how the component would be used:
// <MessageContent content={testMessage} sender="bot" />
