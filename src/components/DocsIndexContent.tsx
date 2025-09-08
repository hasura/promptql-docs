import React from 'react';
import AuthenticationPrompt from "@site/src/components/AuthenticationPrompt";
import IndexPageSidebarController from "@site/src/components/IndexPageSidebarController";

interface DocsIndexContentProps {
  showSidebarController?: boolean;
  showTitle?: boolean;
  className?: string;
}

/**
 * Shared content component for the docs index page
 * Can be used in both the MDX docs/index.mdx and the login page
 */
export const DocsIndexContent: React.FC<DocsIndexContentProps> = ({
  showSidebarController = true,
  showTitle = false,
  className = ""
}) => {
  return (
    <div className={className}>

      {showSidebarController && <IndexPageSidebarController />}

      <div className={'front-matter'}>
        <div>
         <h1>PromptQL Documentation</h1>
          <p>
            Talk to all your data and automate tasks using natural language, with the accuracy and reliability of a human expert.
            <br /><br />
            <a href="https://promptql.io">PromptQL</a> is an AI platform for building agents that speak your business's language, and can understand and act on your data <b>deterministically</b>.
            <br /><br />
            Answer deep questions or build new automations to unlock insights your employees and customers can rely on.
            <br /><br />
            Instantly. Reliably. Accurately.
          </p>
          <div className={'video-wrapper'}>
            <div className={'video-aspect-ratio'}>
              <iframe
                src={"https://www.youtube.com/embed/FrffdbZq9Ow"}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div>
          <AuthenticationPrompt
            title="Access full documentation"
          />
        </div>
      </div>
    </div>
  );
};

export default DocsIndexContent;
