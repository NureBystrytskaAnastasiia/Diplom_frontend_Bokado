import React from 'react';
import './CatAnimation.css';

const CatAnimation: React.FC = () => (
  <div className="cat-wrap" aria-hidden="true">
    <svg width="100%" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg">
      {/* Хвіст */}
      <g className="cat-tail">
        <path
          d="M280 320 Q230 340 215 300 Q200 260 240 255 Q260 252 265 270"
          fill="none" stroke="#9575CD" strokeWidth="18" strokeLinecap="round"
        />
        <ellipse cx="240" cy="254" rx="14" ry="10" fill="#CE93D8" />
      </g>

      {/* Тіло */}
      <g className="cat-body">
        <ellipse cx="315" cy="300" rx="72" ry="62" fill="#9575CD" />
        <ellipse cx="315" cy="308" rx="44" ry="40" fill="#CE93D8" opacity="0.5" />
      </g>

      {/* Лапки */}
      <g className="cat-paw-left">
        <ellipse cx="275" cy="348" rx="22" ry="14" fill="#9575CD" />
        <ellipse cx="275" cy="354" rx="18" ry="9" fill="#B39DDB" />
        <ellipse cx="265" cy="358" rx="5" ry="4" fill="#9575CD" />
        <ellipse cx="275" cy="360" rx="5" ry="4" fill="#9575CD" />
        <ellipse cx="285" cy="358" rx="5" ry="4" fill="#9575CD" />
      </g>
      <g className="cat-paw-right">
        <ellipse cx="355" cy="348" rx="22" ry="14" fill="#9575CD" />
        <ellipse cx="355" cy="354" rx="18" ry="9" fill="#B39DDB" />
        <ellipse cx="345" cy="358" rx="5" ry="4" fill="#9575CD" />
        <ellipse cx="355" cy="360" rx="5" ry="4" fill="#9575CD" />
        <ellipse cx="365" cy="358" rx="5" ry="4" fill="#9575CD" />
      </g>

      {/* Голова */}
      <ellipse cx="315" cy="230" rx="68" ry="62" fill="#9575CD" />

      {/* Вушка */}
      <polygon points="258,185 245,148 282,178" fill="#9575CD" />
      <polygon points="372,185 385,148 348,178" fill="#9575CD" />
      <polygon points="261,182 252,158 278,178" fill="#CE93D8" opacity="0.7" />
      <polygon points="369,182 378,158 352,178" fill="#CE93D8" opacity="0.7" />

      {/* Мордочка */}
      <ellipse cx="315" cy="242" rx="42" ry="34" fill="#B39DDB" opacity="0.45" />

      {/* Очі */}
      <g className="cat-blink-left">
        <ellipse cx="295" cy="228" rx="13" ry="14" fill="#1A0E3A" />
        <ellipse cx="291" cy="224" rx="5" ry="5" fill="#fff" opacity="0.5" />
        <ellipse cx="299" cy="233" rx="3" ry="3" fill="#fff" opacity="0.3" />
      </g>
      <g className="cat-blink-right">
        <ellipse cx="335" cy="228" rx="13" ry="14" fill="#1A0E3A" />
        <ellipse cx="331" cy="224" rx="5" ry="5" fill="#fff" opacity="0.5" />
        <ellipse cx="339" cy="233" rx="3" ry="3" fill="#fff" opacity="0.3" />
      </g>

      {/* Ніс і рот */}
      <polygon points="315,246 310,252 320,252" fill="#7C4DFF" />
      <path d="M310,253 Q315,260 320,253" fill="none" stroke="#7C4DFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M305,253 Q310,256 315,254" fill="none" stroke="#7C4DFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M315,254 Q320,256 325,253" fill="none" stroke="#7C4DFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Вуса */}
      <line x1="292" y1="252" x2="250" y2="246" stroke="#fff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="292" y1="256" x2="248" y2="254" stroke="#fff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="292" y1="260" x2="251" y2="262" stroke="#fff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="338" y1="252" x2="380" y2="246" stroke="#fff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="338" y1="256" x2="382" y2="254" stroke="#fff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="338" y1="260" x2="379" y2="262" stroke="#fff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />

      {/* Знак питання */}
      <text
        x="390" y="195"
        fontFamily="Georgia, serif" fontSize="48" fontWeight="700"
        fill="#CE93D8" opacity="0.8"
        className="cat-question"
      >?</text>

      {/* Зірочки */}
      <g opacity="0.5">
        <circle cx="240" cy="310" r="3" fill="#CE93D8" />
        <circle cx="395" cy="290" r="2" fill="#B39DDB" />
        <circle cx="410" cy="330" r="2.5" fill="#CE93D8" />
      </g>

      {/* Тінь */}
      <ellipse cx="315" cy="374" rx="80" ry="10" fill="#7C4DFF" opacity="0.15" />
    </svg>
  </div>
);

export default CatAnimation;