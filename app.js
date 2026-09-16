/**
 * ============================================================================
 * 남양주시 조직개편 위키백과 심층 뷰어 스크립트 (app.js)
 * 
 * 주요 구현 기능:
 * 1. 계층형 인터랙티브 트리 뷰어 & 사이드바 제어 (접기/펼치기, 위치 스크롤)
 * 2. 실시간 통합 검색 엔진 (인메모리 인덱싱, 키워드 하이라이팅, 모달)
 * 3. 스크롤스파이 (현재 읽고 있는 섹션 실시간 추적)
 * 4. 테마 및 글자 크기 동적 조절 (라이트/다크 모드, 로컬스토리지 저장)
 * 5. 모바일 반응형 터치 인터랙션 (드로어 메뉴, 하단 퀵바)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. 검색용 인덱스 데이터베이스 (Search Index Pool)
  // --------------------------------------------------------------------------
  const searchIndex = [
    {
      id: 'dashboardSection',
      category: '핵심요약',
      filter: 'all',
      title: '2026 조직개편 3대 핵심 요약 대시보드',
      snippet: '시민주권과 신설, 아파트과 명칭 변경 및 공동주택 관리 일원화, 총 51명 정원 증원(실무직 6~8급 100% 배정).'
    },
    {
      id: 'sec-1-1',
      category: '추진배경',
      filter: '자치법규',
      title: 'Ⅰ-1. 추진 목적 및 배경',
      snippet: '국가정책사업 및 민선 9기 시정 역점사업의 체계적 추진, 왕숙 신도시 등 행정수요 증가 대응, 시민주권 중심 행정기반 마련.'
    },
    {
      id: 'sec-1-2',
      category: '추진배경',
      filter: '자치법규',
      title: 'Ⅰ-2. 입법예고 개요 및 절차',
      snippet: '2026년 9월 17일부터 10월 7일까지 20일간 입법예고, 공고 제2026-2036호~제2026-2041호 6개 자치법규 일괄 공고.'
    },
    {
      id: 'sec-2-1',
      category: '자치법규',
      filter: '자치법규',
      title: 'Ⅱ. 남양주시 행정기구설치 조례 일부개정조례안',
      snippet: '제2026-2036호, 시민시장담당관 폐지, 행정국 내 시민주권과 신설, 도시국 주택과를 아파트과로 명칭 변경, 미래도시과 한시정원 2030년까지 연장.'
    },
    {
      id: 'sec-2-2',
      category: '자치법규',
      filter: '자치법규',
      title: 'Ⅱ. 남양주시 행정기구설치 조례 시행규칙 일부개정규칙안',
      snippet: '제2026-2037호, 직급표 개정(별표1), 부서별 분장사무 정비(별표7~9), 공동주택 관리 및 감사 일체 사무 아파트과로 이관.'
    },
    {
      id: 'sec-2',
      category: '자치법규',
      filter: '정원변동',
      title: 'Ⅱ. 남양주시 지방공무원정원 조례 및 규칙 개정안',
      snippet: '제2026-2038호, 제2026-2039호, 공무원 총 정원 2,436명 ➔ 2,487명(51명 증원), 실무직 6~8급 증원, 연간 소요액 약 31.94억 원.'
    },
    {
      id: 'sec-2',
      category: '자치법규',
      filter: '사무위임',
      title: 'Ⅱ. 남양주시 사무위임 조례 및 전결처리 규칙',
      snippet: '제2026-2040호, 제2026-2041호, 위험수목 관리 문구 정비, 개발제한구역(GB) 불법단속 본청 일원화, 신설 부서 전결권 재배분.'
    },
    {
      id: 'sec-3-1',
      category: '기구개편',
      filter: '기구개편',
      title: 'Ⅲ-1. 시민주권과 신설 (행정국)',
      snippet: '시민시장담당관 폐지 후 행정국에 신설, 기본사회 종합계획, 헌법친화도시, 자살예방 총괄기획, 인권업무 총괄, 특이민원 대응 및 피해공무원 보호.'
    },
    {
      id: 'sec-3-1',
      category: '기구개편',
      filter: '기구개편',
      title: 'Ⅲ-1. 민원여권과 현장 집행력 강화',
      snippet: '생활불편 민원처리 총괄, 바로처리 현장기동반 운영, 민원콜센터 운영 및 민원상담·접수·연결 등 현장 민원 실무 통합 흡수.'
    },
    {
      id: 'sec-3-2',
      category: '기구개편',
      filter: '기구개편',
      title: 'Ⅲ-2. 아파트과 개칭 & 공동주택 관리 일원화',
      snippet: '도시국 주택과 ➔ 아파트과 변경, 소규모 공동주택 지원, 집합건물 관리, 주택관리업, 하자증권, 공동주택관리 감사 전반 이관·통합.'
    },
    {
      id: 'sec-3-2',
      category: '기구개편',
      filter: '기구개편',
      title: 'Ⅲ-2. 건축관리과 기능 재정립',
      snippet: '공동주택 관리 이관 후 건축물 안전관리, 지역건축안전센터 운영, 개발제한구역(GB) 내 불법행위 단속 및 행정처분 일원화에 전담 집중.'
    },
    {
      id: 'sec-3-3',
      category: '기구개편',
      filter: '기구개편',
      title: 'Ⅲ-3. 기타 부서별 기능 조정 (보건소·안전관 등)',
      snippet: '시민안전관 재난 동향 파악 신설, 스마트도시과 데이터기반 행정, 보건소 달빛어린이병원 및 통합돌봄, 하천공원관리과 진출입 차단시설.'
    },
    {
      id: 'sec-4-1',
      category: '정원변동',
      filter: '정원변동',
      title: 'Ⅳ-1. 정원 총괄 증감 (+51명)',
      snippet: '총 정원 2,436명에서 2,487명으로 51명 증원(+2.09%), 집행기관 2,396명에서 2,447명으로 증원, 의회사무국 40명 유지.'
    },
    {
      id: 'sec-4-2',
      category: '정원변동',
      filter: '정원변동',
      title: 'Ⅳ-2. 직급별 정원 변동 (6~8급 실무직 100%)',
      snippet: '6급 5명 증원(518➔523명), 7급 18명 증원(665➔683명), 8급 28명 증원(566➔594명), 5급 이상 및 9급 변동 없음.'
    },
    {
      id: 'sec-4-3',
      category: '정원변동',
      filter: '정원변동',
      title: 'Ⅳ-3. 기관별 정원 배분 현황',
      snippet: '본청 +29명(1,194➔1,223명), 읍면동 행정복지센터 +18명(690➔708명), 직속기관 +3명, 사업소 +1명 배정.'
    },
    {
      id: 'sec-4-4',
      category: '정원변동',
      filter: '정원변동',
      title: 'Ⅳ-4. 재정 소요액 (연간 31억 9,400만 원)',
      snippet: '6급 440백만원, 7급 1,231백만원, 8급 1,523백만원, 1년간 인건비 총 3,194백만원 소요 분석.'
    },
    {
      id: 'sec-4-4',
      category: '정원변동',
      filter: '정원변동',
      title: 'Ⅳ-4. 미래도시추진단 4급 한시정원 2030년 연장',
      snippet: '미래도시추진단 미래도시과 일반직 4급 1명, 운영기한을 당초 2027. 1. 1.에서 2030. 1. 1.까지 3년 연장.'
    },
    {
      id: 'sec-5-1',
      category: '사무위임',
      filter: '사무위임',
      title: 'Ⅴ-1. 사무위임 조례 개정 (위험수목, GB 단속)',
      snippet: '위험수목 관리 문구 정비(8272 등 삭제), 개발제한구역 불법단속 제17호 삭제 및 본청 일원화, 제15호 이행강제금/과태료 부대조항 재편.'
    },
    {
      id: 'sec-6-1',
      category: '추진일정',
      filter: '자치법규',
      title: 'Ⅵ-1. 5단계 추진 로드맵 및 시행 시기',
      snippet: '입법예고(9.17~10.7) ➔ 의견검토 ➔ 조례규칙심의회(10월) ➔ 시의회 의결(10~11월) ➔ 최초 인사발령일 전격 시행.'
    }
  ];

  // --------------------------------------------------------------------------
  // 2. 계층형 인터랙티브 트리 네비게이션 제어
  // --------------------------------------------------------------------------
  const treeContainer = document.getElementById('treeContainer');
  const expandAllTreeBtn = document.getElementById('expandAllTreeBtn');
  const collapseAllTreeBtn = document.getElementById('collapseAllTreeBtn');
  const sidebarNav = document.getElementById('sidebarNav');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

  // 부모 노드 접기/펼치기 토글
  treeContainer.addEventListener('click', (e) => {
    const treeChevron = e.target.closest('.tree-chevron');
    const treeItem = e.target.closest('.tree-item');
    const treeChildItem = e.target.closest('.tree-child-item');

    // 쉐브론 화살표 클릭 시: 하위 접기/펼치기만 수행
    if (treeChevron) {
      e.stopPropagation();
      const parentNode = treeChevron.closest('.tree-node');
      if (parentNode) {
        parentNode.classList.toggle('expanded');
      }
      return;
    }

    // 부모 트리 아이템 클릭 시: 섹션 이동 + 펼치기
    if (treeItem) {
      const parentNode = treeItem.closest('.tree-node');
      const targetId = treeItem.getAttribute('data-target');
      
      if (parentNode && parentNode.querySelector('.tree-children')) {
        parentNode.classList.add('expanded');
      }

      if (targetId) {
        scrollToSection(targetId);
      }
      closeMobileSidebar();
      return;
    }

    // 자식 트리 아이템 클릭 시: 해당 섹션 이동
    if (treeChildItem) {
      const targetId = treeChildItem.getAttribute('data-target');
      if (targetId) {
        scrollToSection(targetId);
      }
      closeMobileSidebar();
    }
  });

  // 모두 펼치기 / 모두 접기
  if (expandAllTreeBtn) {
    expandAllTreeBtn.addEventListener('click', () => {
      document.querySelectorAll('.tree-node').forEach(node => node.classList.add('expanded'));
    });
  }

  if (collapseAllTreeBtn) {
    collapseAllTreeBtn.addEventListener('click', () => {
      document.querySelectorAll('.tree-node').forEach(node => node.classList.remove('expanded'));
    });
  }

  // 부드러운 스크롤 이동 함수
  function scrollToSection(id) {
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      // 시각적 펄스 하이라이트 효과
      targetEl.style.transition = 'background-color 0.4s ease';
      const originalBg = targetEl.style.backgroundColor;
      targetEl.style.backgroundColor = 'var(--color-primary-light)';
      setTimeout(() => {
        targetEl.style.backgroundColor = originalBg;
      }, 1200);
    }
  }

  // --------------------------------------------------------------------------
  // 3. 사이드바 제어: 데스크탑 크기 조절(리사이즈), 접기/펼치기 & 모바일 드로어
  // --------------------------------------------------------------------------
  const sidebarResizer = document.getElementById('sidebarResizer');
  const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
  const sidebarExpandTab = document.getElementById('sidebarExpandTab');

  const DEFAULT_SIDEBAR_WIDTH = 290;
  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 480;

  // 1) 데스크탑 사이드바 너비 초기화 및 복원
  let savedSidebarWidth = parseInt(localStorage.getItem('nyj_wiki_sidebar_width'), 10);
  if (!savedSidebarWidth || isNaN(savedSidebarWidth) || savedSidebarWidth < MIN_SIDEBAR_WIDTH || savedSidebarWidth > MAX_SIDEBAR_WIDTH) {
    savedSidebarWidth = DEFAULT_SIDEBAR_WIDTH;
  }
  applySidebarWidth(savedSidebarWidth);

  function applySidebarWidth(width) {
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
  }

  // 2) 데스크탑 사이드바 접힘 상태 초기화 및 복원
  const savedCollapsedState = localStorage.getItem('nyj_wiki_sidebar_collapsed') === 'true';
  if (savedCollapsedState && window.innerWidth > 768) {
    sidebarNav.classList.add('collapsed');
  }

  function toggleDesktopSidebar() {
    const isCollapsed = sidebarNav.classList.toggle('collapsed');
    localStorage.setItem('nyj_wiki_sidebar_collapsed', isCollapsed ? 'true' : 'false');
    showToast(isCollapsed ? '사이드바가 접혔습니다 (Alt+S로 펼치기)' : '사이드바가 펼쳐졌습니다');
  }

  // 3) 모바일 사이드바 드로어 제어
  function openMobileSidebar() {
    sidebarNav.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    sidebarNav.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 헤더 햄버거 메뉴 버튼: 모바일/데스크탑 환경 자동 분기
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        if (sidebarNav.classList.contains('open')) {
          closeMobileSidebar();
        } else {
          openMobileSidebar();
        }
      } else {
        toggleDesktopSidebar();
      }
    });
  }

  // 사이드바 상단 접기 버튼 [ < ]
  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth > 768) {
        toggleDesktopSidebar();
      } else {
        closeMobileSidebar();
      }
    });
  }

  // 접힌 상태에서 복귀용 플로팅 탭 [ > ]
  if (sidebarExpandTab) {
    sidebarExpandTab.addEventListener('click', () => {
      if (sidebarNav.classList.contains('collapsed')) {
        toggleDesktopSidebar();
      }
    });
  }

  // 단축키 Alt + S 로 사이드바 원클릭 접기/펼치기
  document.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
      e.preventDefault();
      if (window.innerWidth <= 768) {
        if (sidebarNav.classList.contains('open')) {
          closeMobileSidebar();
        } else {
          openMobileSidebar();
        }
      } else {
        toggleDesktopSidebar();
      }
    }
  });

  // 4) 마우스 드래그 사이드바 크기 조절 (Resizable Drag)
  if (sidebarResizer) {
    let isResizing = false;

    sidebarResizer.addEventListener('mousedown', (e) => {
      if (window.innerWidth <= 768) return;
      e.preventDefault();
      isResizing = true;
      document.body.classList.add('resizing-sidebar');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, e.clientX));
      applySidebarWidth(newWidth);
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.classList.remove('resizing-sidebar');
        const currentWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'), 10);
        if (currentWidth) {
          localStorage.setItem('nyj_wiki_sidebar_width', currentWidth);
        }
      }
    });

    // 리사이즈 핸들 더블클릭 시 기본 너비(290px)로 즉시 복원
    sidebarResizer.addEventListener('dblclick', () => {
      applySidebarWidth(DEFAULT_SIDEBAR_WIDTH);
      localStorage.setItem('nyj_wiki_sidebar_width', DEFAULT_SIDEBAR_WIDTH);
      showToast(`사이드바 너비가 기본값(${DEFAULT_SIDEBAR_WIDTH}px)으로 초기화되었습니다.`);
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // --------------------------------------------------------------------------
  // 4. 실시간 통합 검색 엔진 (Instant Search Engine)
  // --------------------------------------------------------------------------
  const searchModalOverlay = document.getElementById('searchModalOverlay');
  const searchField = document.getElementById('searchField');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchResultsList = document.getElementById('searchResultsList');
  const headerSearchTrigger = document.getElementById('headerSearchTrigger');
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');
  const mobileSearchQuickBtn = document.getElementById('mobileSearchQuickBtn');
  const filterChips = document.querySelectorAll('.filter-chip');

  let activeFilter = 'all';
  let selectedResultIndex = -1;

  function openSearchModal() {
    searchModalOverlay.classList.add('active');
    searchField.value = '';
    activeFilter = 'all';
    updateFilterUI();
    renderSearchResults('');
    setTimeout(() => searchField.focus(), 80);
    document.body.style.overflow = 'hidden';
  }

  function closeSearchModal() {
    searchModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (headerSearchTrigger) headerSearchTrigger.addEventListener('click', openSearchModal);
  if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', openSearchModal);
  if (mobileSearchQuickBtn) mobileSearchQuickBtn.addEventListener('click', openSearchModal);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchModal);

  searchModalOverlay.addEventListener('click', (e) => {
    if (e.target === searchModalOverlay) closeSearchModal();
  });

  // 단축키: Ctrl + K (또는 Cmd + K) 및 ESC
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape' && searchModalOverlay.classList.contains('active')) {
      closeSearchModal();
    }
  });

  // 필터 칩 클릭 이벤트
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.getAttribute('data-filter');
      updateFilterUI();
      renderSearchResults(searchField.value.trim());
    });
  });

  function updateFilterUI() {
    filterChips.forEach(chip => {
      if (chip.getAttribute('data-filter') === activeFilter) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // 실시간 입력 이벤트
  searchField.addEventListener('input', () => {
    selectedResultIndex = -1;
    renderSearchResults(searchField.value.trim());
  });

  // 키보드 위/아래 방향키 및 Enter 선택
  searchField.addEventListener('keydown', (e) => {
    const items = searchResultsList.querySelectorAll('.search-result-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex + 1) % items.length;
      updateSelectedItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex - 1 + items.length) % items.length;
      updateSelectedItem(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResultIndex >= 0 && items[selectedResultIndex]) {
        items[selectedResultIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      }
    }
  });

  function updateSelectedItem(items) {
    items.forEach((item, idx) => {
      if (idx === selectedResultIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // 검색 결과 렌더링
  function renderSearchResults(query) {
    if (!query) {
      searchResultsList.innerHTML = `
        <div class="search-empty-state">
          <i class="fa-solid fa-keyboard" style="font-size: 32px; margin-bottom: 12px; color: var(--text-muted);"></i>
          <p>검색어를 입력하시면 관련 섹션과 조례 조항을 실시간으로 안내합니다.</p>
          <small style="color: var(--text-muted);">예: 시민주권과, 아파트과, 51명, 비용추계, 한시정원</small>
        </div>
      `;
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filteredResults = searchIndex.filter(item => {
      const matchFilter = (activeFilter === 'all' || item.filter === activeFilter);
      const matchText = item.title.toLowerCase().includes(lowerQuery) || 
                        item.snippet.toLowerCase().includes(lowerQuery) ||
                        item.category.toLowerCase().includes(lowerQuery);
      return matchFilter && matchText;
    });

    if (filteredResults.length === 0) {
      searchResultsList.innerHTML = `
        <div class="search-empty-state">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 32px; margin-bottom: 12px; color: var(--color-warning);"></i>
          <p><strong>'${escapeHtml(query)}'</strong> 에 대한 검색 결과가 없습니다.</p>
          <small style="color: var(--text-muted);">다른 키워드나 상단 카테고리 필터를 변경해 보세요.</small>
        </div>
      `;
      return;
    }

    let html = '';
    filteredResults.forEach((res) => {
      const highlightedTitle = highlightKeyword(res.title, query);
      const highlightedSnippet = highlightKeyword(res.snippet, query);

      html += `
        <div class="search-result-item" data-target="${res.id}">
          <div class="result-item-header">
            <span class="result-item-title">${highlightedTitle}</span>
            <span class="result-item-category">${res.category}</span>
          </div>
          <p class="result-item-snippet">${highlightedSnippet}</p>
        </div>
      `;
    });

    searchResultsList.innerHTML = html;

    // 결과 클릭 시 섹션 이동
    searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        closeSearchModal();
        if (targetId) {
          setTimeout(() => scrollToSection(targetId), 150);
        }
      });
    });
  }

  // 키워드 하이라이팅 헬퍼
  function highlightKeyword(text, keyword) {
    if (!keyword) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --------------------------------------------------------------------------
  // 5. 인터랙티브 신·구 대비 위젯 (Compare Widget Tabs)
  // --------------------------------------------------------------------------
  const compareTabBtns = document.querySelectorAll('.compare-tab-btn');
  compareTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compareTabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.compare-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const paneId = btn.getAttribute('data-pane');
      const activePane = document.getElementById(paneId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. 스크롤스파이 (Scrollspy - 현재 섹션 실시간 추적)
  // --------------------------------------------------------------------------
  const observedSections = document.querySelectorAll('.content-section, #dashboardSection');
  const tocLinks = document.querySelectorAll('.toc-link');
  const treeItems = document.querySelectorAll('.tree-item');

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        
        // TOC 링크 활성화
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // 사이드바 트리 노드 활성화
        treeItems.forEach(item => {
          if (item.getAttribute('data-target') === activeId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  observedSections.forEach(sec => scrollObserver.observe(sec));

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 7. 정밀 글자 크기 및 줄간격 조절 시스템 (Font Scaling System)
  // --------------------------------------------------------------------------
  const fontSizeDisplay = document.getElementById('fontSizeDisplay');
  const fontDecreaseBtn = document.getElementById('fontDecreaseBtn');
  const fontIncreaseBtn = document.getElementById('fontIncreaseBtn');
  const fontSizePopoverToggleBtn = document.getElementById('fontSizePopoverToggleBtn');
  const fontSettingsPopover = document.getElementById('fontSettingsPopover');
  const fontPopoverCloseBtn = document.getElementById('fontPopoverCloseBtn');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const sliderValueBadge = document.getElementById('sliderValueBadge');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const lhNormalBtn = document.getElementById('lhNormalBtn');
  const lhWideBtn = document.getElementById('lhWideBtn');
  const fontResetAllBtn = document.getElementById('fontResetAllBtn');
  const mobileFontQuickBtn = document.getElementById('mobileFontQuickBtn');

  // 기기별 기본 글자 배율: 모바일(<=768px)은 100%, 데스크탑은 110%
  function getDefaultFontScale() {
    return window.innerWidth <= 768 ? 1.0 : 1.10;
  }

  const fontStorageKey = window.innerWidth <= 768 ? 'nyj_wiki_font_scale_m_v4' : 'nyj_wiki_font_scale_d_v4';
  let currentFontScale = parseFloat(localStorage.getItem(fontStorageKey)) || getDefaultFontScale();
  let currentLineHeight = parseFloat(localStorage.getItem('nyj_wiki_line_height')) || 1.72;

  // 초기 폰트 크기 및 줄간격 적용
  applyFontScale(currentFontScale, false);
  applyLineHeight(currentLineHeight, false);

  function applyFontScale(scale, showToastMessage = true) {
    // 0.75 ~ 1.50 범위 제한 (5% 단위 반올림 처리)
    scale = Math.min(1.50, Math.max(0.75, Math.round(scale * 100) / 100));
    currentFontScale = scale;

    const percent = Math.round(scale * 100);

    // CSS 변수 적용
    document.documentElement.style.setProperty('--font-scale', scale);

    // UI 인디케이터 업데이트
    if (fontSizeDisplay) fontSizeDisplay.textContent = `${percent}%`;
    if (fontSizeSlider) fontSizeSlider.value = percent;
    if (sliderValueBadge) sliderValueBadge.textContent = `${percent}%`;

    // 프리셋 버튼 활성화 상태 동기화
    presetBtns.forEach(btn => {
      const btnScale = parseFloat(btn.getAttribute('data-scale'));
      if (Math.abs(btnScale - scale) < 0.03) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 로컬 스토리지에 저장 (기기별 분리 저장)
    const currentKey = window.innerWidth <= 768 ? 'nyj_wiki_font_scale_m_v4' : 'nyj_wiki_font_scale_d_v4';
    localStorage.setItem(currentKey, scale);

    if (showToastMessage) {
      showToast(`글자 크기: ${percent}%`);
    }
  }

  function applyLineHeight(lh, showToastMessage = true) {
    currentLineHeight = lh;
    document.documentElement.style.setProperty('--line-height-base', lh);

    if (lhNormalBtn && lhWideBtn) {
      if (lh >= 1.8) {
        lhNormalBtn.classList.remove('active');
        lhWideBtn.classList.add('active');
      } else {
        lhNormalBtn.classList.add('active');
        lhWideBtn.classList.remove('active');
      }
    }

    localStorage.setItem('nyj_wiki_line_height', lh);

    if (showToastMessage) {
      showToast(lh >= 1.8 ? '줄 간격: 넓게 (1.90)' : '줄 간격: 보통 (1.65)');
    }
  }

  // 팝오버 토글 제어
  function toggleFontPopover(e) {
    if (e) e.stopPropagation();
    if (fontSettingsPopover) {
      fontSettingsPopover.classList.toggle('active');
    }
  }

  function closeFontPopover() {
    if (fontSettingsPopover) {
      fontSettingsPopover.classList.remove('active');
    }
  }

  if (fontSizePopoverToggleBtn) {
    fontSizePopoverToggleBtn.addEventListener('click', toggleFontPopover);
  }

  if (mobileFontQuickBtn) {
    mobileFontQuickBtn.addEventListener('click', (e) => {
      toggleFontPopover(e);
    });
  }

  if (fontPopoverCloseBtn) {
    fontPopoverCloseBtn.addEventListener('click', closeFontPopover);
  }

  // 팝오버 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (fontSettingsPopover && fontSettingsPopover.classList.contains('active')) {
      const isClickInside = fontSettingsPopover.contains(e.target) || 
                            (fontSizePopoverToggleBtn && fontSizePopoverToggleBtn.contains(e.target)) ||
                            (mobileFontQuickBtn && mobileFontQuickBtn.contains(e.target));
      if (!isClickInside) {
        closeFontPopover();
      }
    }
  });

  // 축소 버튼 (A-) 클릭 시 5% 축소
  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyFontScale(currentFontScale - 0.05);
    });
  }

  // 확대 버튼 (A+) 클릭 시 5% 확대
  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyFontScale(currentFontScale + 0.05);
    });
  }

  // 슬라이더 입력 시 실시간 반영
  if (fontSizeSlider) {
    fontSizeSlider.addEventListener('input', () => {
      const val = parseInt(fontSizeSlider.value, 10);
      applyFontScale(val / 100, false);
    });
    fontSizeSlider.addEventListener('change', () => {
      const val = parseInt(fontSizeSlider.value, 10);
      applyFontScale(val / 100, true);
    });
  }

  // 프리셋 버튼 클릭
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const scale = parseFloat(btn.getAttribute('data-scale'));
      applyFontScale(scale, true);
    });
  });

  // 줄 간격 버튼
  if (lhNormalBtn) {
    lhNormalBtn.addEventListener('click', () => applyLineHeight(1.65, true));
  }
  if (lhWideBtn) {
    lhWideBtn.addEventListener('click', () => applyLineHeight(1.90, true));
  }

  // 전체 초기화 (데스크탑 110%, 모바일 100% 자동 분기 리셋)
  if (fontResetAllBtn) {
    fontResetAllBtn.addEventListener('click', () => {
      const defaultScale = getDefaultFontScale();
      applyFontScale(defaultScale, false);
      applyLineHeight(1.72, false);
      showToast(`글자 크기와 줄 간격이 기본값(${Math.round(defaultScale * 100)}%)으로 초기화되었습니다.`);
    });
  }

  // 토스트 알림 헬퍼
  function showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(15, 23, 42, 0.9);
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 9999px;
        font-size: 0.88rem;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        z-index: 3000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 1500);
  }

  // --------------------------------------------------------------------------
  // 8. 다크/라이트 테마 토글
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  // 저장된 테마 불러오기
  const savedTheme = localStorage.getItem('nyj_wiki_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('nyj_wiki_theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      themeToggleBtn.title = '라이트 모드 전환';
    } else {
      icon.className = 'fa-solid fa-moon';
      themeToggleBtn.title = '다크 모드 전환';
    }
  }

  // --------------------------------------------------------------------------
  // 9. 모바일 하단 플로팅 퀵바 제어
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileSummaryBtn = document.getElementById('mobileSummaryBtn');
  const mobileTopBtn = document.getElementById('mobileTopBtn');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      openMobileSidebar();
    });
  }

  if (mobileSummaryBtn) {
    mobileSummaryBtn.addEventListener('click', () => {
      scrollToSection('dashboardSection');
    });
  }

  if (mobileTopBtn) {
    mobileTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
