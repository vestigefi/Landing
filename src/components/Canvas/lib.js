const CELL_SIZE = 4;
const BORDER_WIDTH = 1;
const MAX_FONT_SIZE = 160;
const MAX_ELECTRONS = 0;
const CELL_DISTANCE = CELL_SIZE + BORDER_WIDTH;

// shorter for brighter paint
// be careful of performance issue
const CELL_REPAINT_INTERVAL = [
    900, // from
    1500, // to
];

const BG_COLOR = '#0f0f0f';
const BORDER_COLOR = '#0f0f0f';
const ELECTRON_COLOR = '#303030';

const DPR = window.devicePixelRatio || 1;

const ACTIVE_ELECTRONS = [];
const PINNED_CELLS = [];

class FullscreenCanvas {
    constructor(disableScale = false) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        this.canvas = canvas;
        this.context = context;
        this.disableScale = disableScale;

        this.resizeHandlers = [];
        this.handleResize = _.debounce(this.handleResize.bind(this), 100);

        this.adjust();

        window.addEventListener('resize', this.handleResize);
    }

    adjust() {
        const { canvas, context, disableScale } = this;

        const height = 300;
        const width = window.innerWidth - 40;

        this.width = width;
        this.height = height;

        const scale = disableScale ? 1 : DPR;

        this.realWidth = canvas.width = this.width * scale;
        this.realHeight = canvas.height = this.height * scale;
        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;

        context.scale(scale, scale);
    }

    clear() {
        const { context } = this;

        context.clearRect(0, 0, this.width, this.height);
    }

    makeCallback(fn) {
        fn(this.context, this);
    }

    blendBackground(background, opacity = 0.05) {
        return this.paint((ctx, { realWidth, realHeight, width, height }) => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = opacity;

            ctx.drawImage(background, 0, 0, realWidth, realHeight, 0, 0, width, height);
        });
    }

    paint(fn) {
        if (!_.isFunction(fn)) return;

        const { context } = this;

        context.save();

        this.makeCallback(fn);

        context.restore();

        return this;
    }

    repaint(fn) {
        if (!_.isFunction(fn)) return;

        this.clear();

        return this.paint(fn);
    }

    onResize(fn) {
        if (!_.isFunction(fn)) return;

        this.resizeHandlers.push(fn);
    }

    handleResize() {
        const { resizeHandlers } = this;

        if (!resizeHandlers.length) return;

        this.adjust();

        resizeHandlers.forEach(this.makeCallback.bind(this));
    }

    renderIntoView(target = document.body) {
        const { canvas } = this;

        this.container = target;

        canvas.style.position = 'absolute';
        canvas.style.left = '0px';
        canvas.style.top = '0px';

        target.appendChild(canvas);
    }

    remove() {
        if (!this.container) return;

        try {
            window.removeEventListener('resize', this.handleResize);
            this.container.removeChild(this.canvas);
        } catch (e) {}
    }
}

class Cell {
    constructor(
        row = 0,
        col = 0,
        {
            electronCount = _.random(1, 4),
            background = ELECTRON_COLOR,
            forceElectrons = false,
            electronOptions = {},
        } = {},
    ) {
        this.background = background;
        this.electronOptions = electronOptions;
        this.forceElectrons = forceElectrons;
        this.electronCount = Math.min(electronCount, 4);

        this.startY = row * CELL_DISTANCE;
        this.startX = col * CELL_DISTANCE;
    }

    delay(ms = 0) {
        this.pin(ms * 1.5);
        this.nextUpdate = Date.now() + ms;
    }

    pin(lifeTime = -1 >>> 1) {
        this.expireAt = Date.now() + lifeTime;

        PINNED_CELLS.push(this);
    }

    scheduleUpdate(t1 = CELL_REPAINT_INTERVAL[0], t2 = CELL_REPAINT_INTERVAL[1]) {
        this.nextUpdate = Date.now() + _.random(t1, t2);
    }

    paintNextTo(layer = new FullscreenCanvas()) {
        const { startX, startY, background, nextUpdate } = this;

        if (nextUpdate && Date.now() < nextUpdate) return;

        this.scheduleUpdate();

        layer.paint((ctx) => {
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = background;
            ctx.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
        });
    }

    popRandom(arr = []) {
        const ramIdx = _.random(arr.length - 1);

        return arr.splice(ramIdx, 1)[0];
    }
}

const bgLayer = new FullscreenCanvas();
const mainLayer = new FullscreenCanvas();
const shapeLayer = new FullscreenCanvas(true);

function createRandomCell(options = {}) {
    if (ACTIVE_ELECTRONS.length >= MAX_ELECTRONS) return;

    const { width, height } = mainLayer;

    const cell = new Cell(_.random(height / CELL_DISTANCE), _.random(width / CELL_DISTANCE), options);

    cell.paintNextTo(mainLayer);
}

function drawGrid() {
    bgLayer.paint((ctx, { width, height }) => {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = BORDER_COLOR;

        // horizontal lines
        for (let h = CELL_SIZE; h < height; h += CELL_DISTANCE) {
            ctx.fillRect(0, h, width, BORDER_WIDTH);
        }

        // vertical lines
        for (let w = CELL_SIZE; w < width; w += CELL_DISTANCE) {
            ctx.fillRect(w, 0, BORDER_WIDTH, height);
        }
    });
}

function iterateItemsIn(list) {
    const now = Date.now();

    for (let i = 0, max = list.length; i < max; i++) {
        const item = list[i];

        if (now >= item.expireAt) {
            list.splice(i, 1);
            i--;
            max--;
        } else {
            item.paintNextTo(mainLayer);
        }
    }
}

function drawItems() {
    iterateItemsIn(PINNED_CELLS);
    iterateItemsIn(ACTIVE_ELECTRONS);
}

let nextRandomAt;

function activateRandom() {
    const now = Date.now();

    if (now < nextRandomAt) {
        return;
    }

    nextRandomAt = now + _.random(300, 1000);

    createRandomCell();
}

function prepaint() {
    drawGrid();

    mainLayer.paint((ctx, { width, height }) => {
        // composite with rgba(255,255,255,255) to clear trails
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, width, height);
    });

    mainLayer.blendBackground(bgLayer.canvas, 0.9);
}

function render() {
    mainLayer.blendBackground(bgLayer.canvas);

    drawItems();
    activateRandom();

    shape.renderID = requestAnimationFrame(render);
}

export const shape = {
    lastText: '',
    lastMatrix: null,
    renderID: undefined,
    isAlive: false,

    init(container = document.body) {
        if (this.isAlive) {
            return;
        }

        bgLayer.onResize(drawGrid);
        mainLayer.onResize(prepaint);

        mainLayer.renderIntoView(container);

        shapeLayer.onResize(() => {
            if (this.lastText) {
                this.print(this.lastText);
            }
        });

        prepaint();
        render();

        this.isAlive = true;
    },

    clear() {
        this.lastText = '';
        this.lastMatrix = null;
        PINNED_CELLS.length = 0;
    },

    destroy() {
        if (!this.isAlive) {
            return;
        }

        bgLayer.remove();
        mainLayer.remove();
        shapeLayer.remove();

        this.unbindEvents();

        cancelAnimationFrame(this.renderID);

        ACTIVE_ELECTRONS.length = PINNED_CELLS.length = 0;
        this.lastMatrix = null;
        this.lastText = '';
        this.isAlive = false;
    },

    getTextMatrix(text, { fontWeight = 'bold' } = {}) {
        const { width, height } = shapeLayer;

        shapeLayer.repaint((ctx) => {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${fontWeight} italic ${MAX_FONT_SIZE}px Josefin Sans`;
            ctx.fillText(text, width / 2, height / 2);
        });

        const pixels = shapeLayer.context.getImageData(0, 0, width, height).data;
        const matrix = [];

        for (let i = 0; i < height; i += CELL_DISTANCE) {
            for (let j = 0; j < width; j += CELL_DISTANCE) {
                const alpha = pixels[(j + i * width) * 4 + 3];

                if (alpha > 0) {
                    matrix.push([Math.floor(i / CELL_DISTANCE), Math.floor(j / CELL_DISTANCE)]);
                }
            }
        }

        return matrix;
    },

    print(text, options) {
        this.clear();

        this.lastText = text;

        const matrix = (this.lastMatrix = _.shuffle(this.getTextMatrix(text, options)));

        matrix.forEach(([i, j]) => {
            const cell = new Cell(i, j, this.cellOptions);

            cell.scheduleUpdate(200);
            cell.pin();
        });
    },
};
