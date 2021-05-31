export const common = {
    splashLargeVerticalPadding: {
        paddingTop: '50px',
        paddingBottom: '50px',
    },
    splashMidVerticalMargin: {
        marginTop: '32px',
        marginBottom: '32px',
    }
};

export const StylelessAnchor = {
    'color': 'inherit',
    'text-decoration': 'none',
}

export const horizontalMargin = (size: number | string) => ({
    'margin-left': size,
    'margin-right': size,
});

export const horizontalPadding = (size: number | string) => ({
    'padding-left': size,
    'padding-right': size,
});

export const verticalMargin = (size: number) => ({
    'margin-top': size,
    'margin-bottom': size,
});
