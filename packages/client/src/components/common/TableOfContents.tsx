import React, { useEffect, useState, useRef } from 'react';
import { slugify } from '@tunji-web/server/src/models/Archive';


interface Heading {
    id: string;
    title: string;
    items: Heading[];
}

interface HeadingProps {
    headings: Heading[];
    activeId?: string;
}

/**
 * This renders an item in the table of contents list.
 * scrollIntoView is used to ensure that when a user clicks on an item, it will smoothly scroll.
 */
const Headings: (props: HeadingProps) => JSX.Element = ({headings, activeId}) => (
    <ul>
        {headings.map((heading) => (
            <li key={heading.id} className={heading.id === activeId ? 'active' : ''}>
                <a
                    href={`#${heading.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(`#${heading.id}`)?.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }}
                >
                    {heading.title}
                </a>
                {heading.items.length > 0 && (
                    <ul>
                        {heading.items.map((child) => (
                            <li
                                key={child.id}
                                className={child.id === activeId ? 'active' : ''}
                            >
                                <a
                                    href={`#${child.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector(`#${child.id}`)?.scrollIntoView({
                                            behavior: 'smooth'
                                        });
                                    }}
                                >
                                    {child.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        ))}
    </ul>
);
const useIntersectionObserver = (setActiveId: (a: string) => void) => {
    const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});
    useEffect(() => {
        const callback: IntersectionObserverCallback = (headings) => {
            headingElementsRef.current = headings.reduce((map, headingElement) => {
                map[headingElement.target.id] = headingElement;
                return map;
            }, headingElementsRef.current);

            // Get all headings that are currently visible on the page
            const visibleHeadings: IntersectionObserverEntry[] = [];
            Object.keys(headingElementsRef.current).forEach((key) => {
                const headingElement: IntersectionObserverEntry = headingElementsRef.current[key];
                if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
            });

            const getIndexFromId: (id: string) => number = (id) =>
                headingElements.findIndex((heading) => heading.id === id);

            // If there is only one visible heading, this is our "active" heading
            if (visibleHeadings.length === 1) {
                setActiveId(visibleHeadings[0].target.id);
                // If there is more than one visible heading,
                // choose the one that is closest to the top of the page
            } else if (visibleHeadings.length > 1) {
                const sortedVisibleHeadings = visibleHeadings.sort(
                    (a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id)
                );

                setActiveId(sortedVisibleHeadings[0].target.id);
            }
        };

        const observer = new IntersectionObserver(callback, {
            root: document.querySelector('iframe'),
            rootMargin: '500px'
        });

        const headingElements: HTMLHeadingElement[] = Array.from(document.querySelectorAll('h2, h3'));

        headingElements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [setActiveId]);
};

export interface TOCProps {
    markdown: string;
}

const extractHeadings = (markdown: string) => {
    const levelsToShow = 3;
    const headings: Heading[] = [];
    let isCodeBlock = false;
    let topLevel = NaN;

    for (let line of markdown.split('\n')) {

        const trimmed = line.trim();

        if (trimmed.startsWith('```')) {
            isCodeBlock = !isCodeBlock;
        }

        if (isCodeBlock) {
            continue;
        }

        let level = NaN;
        let title = null;

        // Check for:
        // 1. ATX-style headers: ## My Header


        if (trimmed.startsWith('#')) {
            const match = trimmed.match(/(#+)\s*(.*?)#*\s*$/);
            if (!match) continue;
            level = match[1].length;
            title = match[2].trim();
        }

        if (!isNaN(level) && title != null) {
            if (isNaN(topLevel)) topLevel = level;

            if (level - topLevel >= levelsToShow) continue;

            const id = slugify(title);
            const heading = {id, title, items: []};

            let items: Heading[] | undefined = headings;
            let i = 2;

            while (i < level) {
                items = (items && items.length < 1)
                    ? undefined
                    : items
                        ? items[items.length - 1].items
                        : items;
                ++i;
            }
            if (items) items.push(heading);
        }
    }

    return headings;
};
/**
 * Renders the table of contents.
 */
export const TableOfContents: (props: TOCProps) => JSX.Element = ({markdown}) => {
    const [activeId, setActiveId] = useState<string>();
    const nestedHeadings = extractHeadings(markdown);
    useIntersectionObserver(setActiveId);

    return (
        <nav aria-label="Table of contents">
            <Headings headings={nestedHeadings} activeId={activeId}/>
        </nav>
    );
};

