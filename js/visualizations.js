// Simple responsive SVG chart rendering from data/analysis.json
(function(){
  function createSVG(width, height){
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = '100%';
    return svg;
  }

  function linePath(points){
    return points.map((p,i)=> (i? 'L':'M') + p[0] + ' ' + p[1]).join(' ');
  }

  async function fetchData(url){
    const res = await fetch(url);
    if(!res.ok) throw new Error('Failed to load ' + url);
    return res.json();
  }

  function scale(domainMin, domainMax, rangeMin, rangeMax){
    const d = domainMax - domainMin || 1;
    const r = rangeMax - rangeMin;
    return (x) => rangeMin + ( (x - domainMin) / d ) * r;
  }

  function render(container, data){
    const W = 960, H = 480, M = {t:40,r:30,b:60,l:60};
    container.innerHTML = '';
    const svg = createSVG(W, H);
    container.appendChild(svg);

    // Flatten series to compute global min/max
    const quarters = data.quarters;
    const series = data.series;
    const allValues = series.flatMap(s => s.values);
    const ymin = Math.min(...allValues);
    const ymax = Math.max(...allValues);

    const x = scale(0, quarters.length-1, M.l, W - M.r);
    const y = scale(ymin, ymax, H - M.b, M.t);

    // Axes (minimal)
    const axis = document.createElementNS(svg.namespaceURI, 'g');
    axis.setAttribute('fill', 'currentColor');
    axis.setAttribute('stroke', 'currentColor');
    svg.appendChild(axis);

    // X ticks
    quarters.forEach((q, i) => {
      const tx = x(i);
      const ty = H - M.b;
      const tick = document.createElementNS(svg.namespaceURI, 'line');
      tick.setAttribute('x1', tx);
      tick.setAttribute('x2', tx);
      tick.setAttribute('y1', ty);
      tick.setAttribute('y2', ty + 6);
      tick.setAttribute('stroke-width', '1');
      axis.appendChild(tick);

      const label = document.createElementNS(svg.namespaceURI, 'text');
      label.setAttribute('x', tx);
      label.setAttribute('y', ty + 20);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '12');
      label.textContent = q;
      axis.appendChild(label);
    });

    // Y ticks (5)
    const ticks = 5;
    for(let i=0;i<=ticks;i++){
      const v = ymin + (i*(ymax-ymin)/ticks);
      const ty = y(v);
      const line = document.createElementNS(svg.namespaceURI, 'line');
      line.setAttribute('x1', M.l);
      line.setAttribute('x2', W - M.r);
      line.setAttribute('y1', ty);
      line.setAttribute('y2', ty);
      line.setAttribute('stroke-width', '0.5');
      line.setAttribute('opacity', '0.3');
      svg.appendChild(line);

      const label = document.createElementNS(svg.namespaceURI, 'text');
      label.setAttribute('x', M.l - 8);
      label.setAttribute('y', ty + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('font-size', '12');
      label.textContent = Math.round(v).toLocaleString();
      svg.appendChild(label);
    }

    // Series lines
    series.forEach((s, idx) => {
      const pts = s.values.map((v,i)=>[x(i), y(v)]);
      const path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('d', linePath(pts));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('opacity', 0.9 - idx*0.2);
      svg.appendChild(path);
    });

    // Legend
    const legend = document.createElementNS(svg.namespaceURI, 'g');
    svg.appendChild(legend);
    series.forEach((s, i)=>{
      const y0 = M.t + i*20;
      const swatch = document.createElementNS(svg.namespaceURI, 'line');
      swatch.setAttribute('x1', W - M.r - 90);
      swatch.setAttribute('x2', W - M.r - 60);
      swatch.setAttribute('y1', y0);
      swatch.setAttribute('y2', y0);
      swatch.setAttribute('stroke', 'currentColor');
      swatch.setAttribute('stroke-width', '3');
      swatch.setAttribute('opacity', 0.9 - i*0.2);
      legend.appendChild(swatch);

      const label = document.createElementNS(svg.namespaceURI, 'text');
      label.setAttribute('x', W - M.r - 55);
      label.setAttribute('y', y0 + 4);
      label.setAttribute('font-size', '12');
      label.textContent = s.name;
      legend.appendChild(label);
    });
  }

  async function renderKPIChart(){
    const container = document.getElementById('kpi-chart');
    if(!container) return;
    try {
      const url = container.getAttribute('data-src') || 'data/analysis.json';
      const data = await fetchData(url + (window.location.search || ''));
      const draw = () => render(container, data);
      draw();
      window.addEventListener('resize', draw);
    } catch (err) {
      container.textContent = 'Failed to load chart data: ' + err.message;
    }
  }

  // Expose to window so Reveal init can call it
  window.renderKPIChart = renderKPIChart;
})();
