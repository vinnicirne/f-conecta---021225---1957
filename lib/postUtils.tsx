import React from 'react';

// Utility functions for parsing post content

/**
 * Extract hashtags from text
 */
export const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
};

/**
 * Extract mentions from text
 */
export const extractMentions = (text: string): string[] => {
    const mentionRegex = /@[\w\u00C0-\u017F]+/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.slice(1)) : [];
};

/**
 * Parse text and convert hashtags and mentions to clickable links
 */
export const parsePostContent = (text: string): React.ReactNode => {
    if (!text) return null;

    // Preserve line breaks
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        // Combined regex for hashtags and mentions
        const regex = /(#[\w\u00C0-\u017F]+|@[\w\u00C0-\u017F]+)/g;
        let match;

        while ((match = regex.exec(line)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push(line.substring(lastIndex, match.index));
            }

            // Add the hashtag or mention as a clickable element
            const matchedText = match[0];
            if (matchedText.startsWith('#')) {
                parts.push(
                    <span
                        key={`${lineIndex}-${match.index}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Navigate to hashtag search
                            console.log('Search hashtag:', matchedText.slice(1));
                        }}
                    >
                        {matchedText}
                    </span>
                );
            } else if (matchedText.startsWith('@')) {
                parts.push(
                    <span
                        key={`${lineIndex}-${match.index}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Navigate to user profile
                            console.log('View profile:', matchedText.slice(1));
                        }}
                    >
                        {matchedText}
                    </span>
                );
            }

            lastIndex = match.index + matchedText.length;
        }

        // Add remaining text
        if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
        }

        // Return line with line break
        return (
            <React.Fragment key={lineIndex}>
                {parts.length > 0 ? parts : line}
                {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
        );
    });
};
