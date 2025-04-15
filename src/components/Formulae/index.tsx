const UsefulnessFormula = () => (
  <div className="md:p-6">
    <MathJax>
      <p className="text-center text-lg mb-6 overflow-x-auto overflow-y-hidden no-scrollbar scrollbar-hide">
        {
          '\\[\\text{Usefulness} = (\\text{CompAcc}^{w} \\times \\text{CogAcc}^{(1-w)}) \\times (\\text{CompRep}^{w} \\times \\text{CogRep}^{(1-w)})\\]'
        }
      </p>
    </MathJax>

    <p className="pb-1">Where:</p>
    <ul className="space-y-4 list-disc list-inside md:pl-6">
      <li className="flex flex-col">
        <MathJax>
          <span className="font-semibold italic">{'\\(\\text{CompAcc}\\) (Computational Accuracy)'}</span>
        </MathJax>
        <span className="text-gray-700">
          A user-assigned score between 0 and 1 indicating how accurately the system handles computational (algorithmic)
          tasks.
        </span>
      </li>
      <li className="flex flex-col">
        <MathJax>
          <span className="font-semibold italic">{'\\(\\text{CogAcc}\\) (Cognitive Accuracy)'}</span>
        </MathJax>
        <span className="text-gray-700">
          A user-assigned score between 0 and 1 indicating the system&apos;s accuracy on more interpretive, cognitive
          tasks.
        </span>
      </li>
      <li className="flex flex-col">
        <MathJax>
          <span className="font-semibold italic">{'\\(\\text{CompRep}\\) (Computational Repeatability)'}</span>
        </MathJax>
        <MathJax className="my-2">{'\\[\\text{CompRep} = \\exp(-\\alpha_{C}(1 - C))\\]'}</MathJax>
        <span className="text-gray-700">
          This transforms the raw computational repeatability measure (<i>C</i>, ranging from 0 to 1) into a value
          between 0 and 1. A higher{' '}
          <i>
            α<sub>C</sub>
          </i>{' '}
          means that any deviation from perfect computational repeatability (C=1) is penalized more severely. In plain
          English: This score heavily rewards systems that deliver the same computational results every time.
        </span>
      </li>
      <li className="flex flex-col">
        <MathJax>
          <span className="font-semibold italic">{'\\(\\text{CogRep}\\) (Cognitive Repeatability)'}</span>
        </MathJax>
        <MathJax className="my-2">{'\\[\\text{CogRep} = \\exp(-\\alpha_{K}(1 - K))\\]'}</MathJax>
        <span className="text-gray-700">
          Similar to CompRep, this takes a raw cognitive repeatability measure (<i>K</i>, 0 to 1) and maps it to a
          0-to-1 scale. Here,{' '}
          <i>
            α<sub>K</sub>
          </i>{' '}
          controls how harshly deviations from perfect repeatability are penalized for cognitive tasks. In other words,
          this score measures how consistently the system provides similar cognitive outputs across multiple runs,
          typically allowing for a bit more variation than computational tasks if{' '}
          <i>
            α<sub>K</sub>
          </i>{' '}
          is smaller than{' '}
          <i>
            α<sub>C</sub>
          </i>
          .
        </span>
      </li>
      <li className="flex flex-col">
        <MathJax>
          <span className="font-semibold italic">{'\\(w\\)'}</span>
        </MathJax>
        <span className="text-gray-700">
          A weighting factor between 0 and 1 that determines the relative importance of computational versus cognitive
          factors in both accuracy and repeatability.
        </span>
      </li>
    </ul>
  </div>
);
