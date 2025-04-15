import React from 'react';

interface QuestionRow {
  question: string;
  claude: string;
  promptql: string;
  answer: string;
}

const questions: QuestionRow[] = [
  {
    question:
      "If my future wife has the same first name as the 15th first lady of the United States' mother and her surname is the same as the second assassinated president's mother's maiden name, what is my future wife's name?",
    claude: 'Eliza Ballou',
    promptql: 'Jane Ballou',
    answer: 'Jane Ballou',
  },
  {
    question:
      "I have an element in mind and would like you to identify the person it was named after. Here's a clue: The element's atomic number is 9 higher than that of an element discovered by the scientist who discovered Zirconium in the same year.",
    claude: 'Dmitri Mendeleev',
    promptql: 'Dmitri Mendeleev',
    answer: 'Dmitri Mendeleev',
  },
  {
    question:
      'A general motors vehicle is named after the largest ward in the country of Monaco. How many people had walked on the moon as of the first model year of the vehicle? Note: the model year is not the same as the year the model was first produced.',
    claude: 'Context length error',
    promptql: '4',
    answer: '4',
  },
  {
    question:
      'On March 7th, 2012, the director James Cameron explored a very deep underseas trench. As of August 3, 2024, how many times would the tallest building in San Francisco fit end to end from the bottom of the New Britain Trench to the surface of the ocean? The answer should be a rounded-off whole number.',
    claude: '28',
    promptql: '28',
    answer: '28',
  },
  {
    question:
      'In August of 2024, what is the first name of the mayor of the U.S. state capital city who attended the same university as at least one U.S. president and whose city is home to an outgoing or former full member of the Big 12 Conference',
    claude: 'Cannot determine',
    promptql: 'Leirion',
    answer: 'Leirion',
  },
  {
    question:
      'According to the 1990 United States census, what was the total population of the cities in Oklahoma that had at least 100,000 residents according to the 2020 United States census?',
    claude: '892,092',
    promptql: '950,135',
    answer: '950,135',
  },
  {
    question:
      'As of July 1, 2024, if I wanted to give my daughter the middle name of the American woman who is the most decorated female in the history of American gymnastics as her first name and the full first name of the American woman who holds the world record in the 800-meter freestyle as her middle name, what would I name my daughter?',
    claude: 'Arianne Kathleen',
    promptql: 'Arianne Kathleen',
    answer: 'Arianne Kathleen',
  },
  {
    question:
      'As of 2023, how many more employees does the company alphabetically first by ticker symbol in the S&P500 have than the company alphabetically 2nd to last by ticker symbol in the S&P500?',
    claude: '151,250 (Apple - Zebra)',
    promptql: '8,150 (Agilent - Zebra)',
    answer: '8,150 (Agilent - Zebra)',
  },
  {
    question:
      'The state, whose motto was adopted March 26, 1928, has 0.94% of the population in 2024 speaking a language that is native to which country?',
    claude: 'Philippines',
    promptql: 'Philippines',
    answer: 'Philippines',
  },
  {
    question:
      'As of 2024, at the time of his birth, what was the middle name of the U.S. president who won Alaska, graduated from Yale University, and had a son named Michael?',
    claude: 'No president found',
    promptql: 'Lynch',
    answer: 'Lynch',
  },
];

const FRAMESQuestionTable = () => {
  // Add state for expanded status
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Get visible questions
  const visibleQuestions = isExpanded ? questions : questions.slice(0, 1);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          width: '100%',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              width: '50%',
              padding: '1rem',
              borderRight: '1px solid #e5e7eb',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <b>Questions</b>
          </div>
          <div
            style={{
              width: '50%',
              padding: '1rem',
              color: '#4b5563',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          ></div>
        </div>

        {/* Limit the container height when not expanded */}
        <div
          style={{
            maxHeight: !isExpanded ? '500px' : 'none',
            overflow: 'hidden',
          }}
        >
          {visibleQuestions.map((row, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                width: '100%',
                borderBottom: '1px solid #e5e7eb',
                minHeight: '200px',
              }}
            >
              <div
                style={{
                  width: '50%',
                  padding: '1rem',
                  borderRight: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {row.question}
              </div>
              <div
                style={{
                  width: '50%',
                  display: 'grid',
                  gridTemplateRows: 'repeat(3, auto)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      width: '50%',
                      padding: '1rem',
                      borderRight: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Agentic RAG
                  </div>
                  <div
                    style={{
                      width: '50%',
                      padding: '1rem',
                      color: '#4b5563',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: row.claude === row.answer ? '#dcfce7' : '#fee2e2',
                    }}
                  >
                    {row.claude}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      width: '50%',
                      padding: '1rem',
                      borderRight: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    PromptQL
                  </div>
                  <div
                    style={{
                      width: '50%',
                      padding: '1rem',
                      color: '#4b5563',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: row.promptql === row.answer ? '#dcfce7' : '#fee2e2',
                    }}
                  >
                    {row.promptql}
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      width: '50%',
                      padding: '1rem',
                      borderRight: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Correct answer
                  </div>
                  <div
                    style={{
                      width: '50%',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {row.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlay and expand button */}
      {!isExpanded && questions.length > 2 && (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '8rem',
              bottom: '40px',
              background: 'linear-gradient(to top, white 20%, transparent 100%)',
            }}
          />
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              width: '100%',
              padding: '1rem 0',
              color: '#2563eb',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              position: 'relative',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#1e40af')}
            onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}
          >
            Show all {questions.length} questions
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Collapse button - shown when expanded */}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            width: '100%',
            padding: '1rem 0',
            color: '#2563eb',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
          onMouseOver={e => (e.currentTarget.style.color = '#1e40af')}
          onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}
        >
          Show less
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FRAMESQuestionTable;
