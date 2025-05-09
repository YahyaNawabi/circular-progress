class CircularProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --size: 220px;
          --track-color: #e0e0e0;
          --transition: 0.4s ease;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          color: var(--text-light);
          transition: color 0.3s ease;
        }

        :host-context(body.dark) .wrapper {
          color: var(--text-dark);
        }

        .progress-container {
          position: relative;
          width: var(--size);
          height: var(--size);
        }

        svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .bg,
        .progress {
          fill: none;
          stroke-width: 10;
          r: 45;
          cx: 50;
          cy: 50;
        }

        .bg {
          stroke: var(--track-color);
        }

        .progress {
          stroke: url(#gradient);
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          stroke-linecap: round;
          transition: stroke-dashoffset var(--transition);
        }

        .text-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .text-content span {
          font-size: 2rem;
          font-weight: bold;
        }

        .text-content small {
          font-size: 0.85rem;
        }

        input[type="range"] {
          margin-top: 1.5rem;
          width: 80%;
          max-width: 300px;
        }

        .controls {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        button {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        button:hover {
          background: #0056b3;
        }

        .theme-toggle {
          margin-top: 2rem;
          cursor: pointer;
          font-size: 0.9rem;
          opacity: 0.6;
        }
      </style>

      <div class="wrapper">
        <div class="progress-container">
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stop-color="#00c6ff" />
                <stop offset="100%" stop-color="#0072ff" />
              </linearGradient>
            </defs>
            <circle class="bg" cx="50" cy="50" r="45" />
            <circle class="progress" cx="50" cy="50" r="45" />
          </svg>
          <div class="text-content">
            <span id="value">0%</span>
            <small id="label">Starting...</small>
          </div>
        </div>

        <input type="range" id="slider" min="0" max="100" value="0" />

        <div class="controls">
          <button id="random">Random</button>
          <button id="reset">Reset</button>
          <div class="theme-toggle" id="theme-toggle">🌓 Toggle Dark Mode</div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.slider = this.shadowRoot.getElementById('slider');
    this.valueText = this.shadowRoot.getElementById('value');
    this.labelText = this.shadowRoot.getElementById('label');
    this.progressCircle = this.shadowRoot.querySelector('.progress');
    this.gradient = this.shadowRoot.querySelector('#gradient');
    this.radius = 45;
    this.circumference = 2 * Math.PI * this.radius;

    this.progressCircle.style.strokeDasharray = this.circumference;

    this.slider.addEventListener('input', () => {
      this.setProgress(+this.slider.value);
    });

    this.shadowRoot.getElementById('reset').addEventListener('click', () => {
      this.setProgress(0);
      this.slider.value = 0;
    });

    this.shadowRoot.getElementById('random').addEventListener('click', () => {
      const val = Math.floor(Math.random() * 101);
      this.setProgress(val);
      this.slider.value = val;
    });

    this.shadowRoot.getElementById('theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });

    this.setProgress(0);
  }

  getLabel(percent) {
    if (percent < 30) return "Poor";
    if (percent < 70) return "Average";
    return "Excellent";
  }

  getColor(percent) {
    if (percent < 30) return "#ff4e4e";
    if (percent < 70) return "#ffc107";
    return "#28a745";
  }

  setProgress(percent) {
    const offset = this.circumference - (percent / 100) * this.circumference;
    this.progressCircle.style.strokeDashoffset = offset;
    this.valueText.textContent = `${percent}%`;
    this.labelText.textContent = this.getLabel(percent);

    this.gradient.innerHTML = `
      <stop offset="0%" stop-color="${this.getColor(percent)}" />
      <stop offset="100%" stop-color="${this.getColor(percent)}" />
    `;
  }
}

customElements.define('circular-progress', CircularProgress);
