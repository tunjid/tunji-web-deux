import React, { useEffect, useRef, useState } from 'react';
import { slugify } from '@tunji-web/common';
import { styled } from '@mui/material/styles';
import { Link as MuiLink, List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';

const linkBar = {
    content: '\'\'',
    backgroundColor: '#05202E',
    position: 'absolute',
    left: '-6px',
    bottom: '0px',
    width: '3px',
    height: '0px',
    zIndex: -1,
    transition: 'all .3s ease-in-out'
};

const StyledList = styled(List)(({theme}) => ({
    'padding-left': '12px',
    'list-style-type': 'none',
    'oveflow': 'auto',
}));

const StyledListItem = styled(ListItem)(({theme}) => ({
    // [theme.breakpoints.up('md')]: {
    //     padding: '3px 0',
    // },
    padding: '6px 0',
}));

const StyledActiveLink = styled(MuiLink)(({theme}) => ({
    'color': theme.palette.primary.main,
    'text-decoration': 'none',
    position: 'relative',
    '&::before': {
        ...linkBar,
        height: '100%',
    },
}));

const StyledInactiveLink = styled(MuiLink)(({theme}) => ({
    'color': 'inherit',
    'text-decoration': 'none',
    position: 'relative',
    '&::before': {
        ...linkBar
    },
    '&:hover::before': {
        ...linkBar,
        bottom: '0',
        height: '100%'
    },
}));

interface Heading {
    id: string;
    title: string;
    items: Heading[];
}

interface HeadingProps {
    headings: Heading[];
    activeId?: string;
}
const StyledLink: (props: HeadingProps) => JSX.Element = ({isActive, ...props}: any) => {
    return isActive ? <StyledActiveLink {...props} /> : <StyledInactiveLink {...props} />;
};

/**
 * This renders an item in the table of contents list.
 * scrollIntoView is used to ensure that when a user clicks on an item, it will smoothly scroll.
 */
const Headings: (props: HeadingProps) => JSX.Element = ({headings, activeId}) => {
    return (
        <StyledList>
            {headings.map((heading) => (
                <li
                    key={heading.id}
                >
                    <StyledLink isActive={heading.id === activeId}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            const yOffset = -80;
                            const element = document.getElementById(`${heading.id}`);
                            const y = (element?.getBoundingClientRect().top || 0) + window.scrollY + yOffset;

                            window.scrollTo({top: y, behavior: 'smooth'});
                        }}
                    >
                        <Typography variant={'caption'}>
                            {heading.title}
                        </Typography>
                    </StyledLink>
                    {heading.items.length > 0 && <Headings headings={heading.items} activeId={activeId}/>}
                </li>
            ))}
        </StyledList>
    );
};

function flattenHeading(heading: Heading): Heading[] {
    const flattened: Heading[] = [];

    function traverse(items: Heading[]) {
        for (const item of items) {
            flattened.push(item);
            if (item.items && item.items.length > 0) {
                traverse(item.items);
            }
        }
    }

    traverse([heading]);
    return flattened;
}

const useIntersectionObserver = (headings: Heading[], setActiveId: (a: string) => void) => {
    const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});
    useEffect(() => {
        const callback: IntersectionObserverCallback = (headingEntries) => {
            headingElementsRef.current = headingEntries.reduce((map, headingElement) => {
                map[headingElement.target.id] = headingElement;
                return map;
            }, headingElementsRef.current);

            // Get all headings that are currently visible on the page
            const visibleHeadings: IntersectionObserverEntry[] = [];
            Object.keys(headingElementsRef.current).forEach((key) => {
                const headingElement: IntersectionObserverEntry = headingElementsRef.current[key];
                if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
            });

            // If there is only one visible heading, this is our "active" heading
            if (visibleHeadings.length === 1) {
                setActiveId(visibleHeadings[0].target.id);
                // If there is more than one visible heading,
                // choose the one that is closest to the top of the page
            } else if (visibleHeadings.length > 1) {
                const sortedVisibleHeadings = visibleHeadings.sort(
                    (a, b) => {
                        return Math.abs(a.target.getBoundingClientRect().top) - Math.abs(b.target.getBoundingClientRect().top);
                    }
                );
                setActiveId(sortedVisibleHeadings[0].target.id);
            }
        };
        const observer = new IntersectionObserver(callback);

        const headingIds = headings
            .map(flattenHeading)
            .flat()
            .map(heading => `#${heading.id}`)
            .join(', ');

        const headingElements: HTMLHeadingElement[] = headingIds ? Array.from(document.querySelectorAll(headingIds)) : [];
        headingElements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [headings, setActiveId]);
};

export interface TOCProps {
    markdown: string;
}

const extractHeadings = (markdown: string) => {
    const levelsToShow = 4;
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
    const headings = extractHeadings(markdown);
    useIntersectionObserver(headings, setActiveId);

    return (
        <nav>
            <Headings headings={headings} activeId={activeId}/>
        </nav>
    );
};

