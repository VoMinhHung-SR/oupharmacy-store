'use client'

import React from 'react'
import { SearchIcon } from '@/components/icons'
import { HeaderSearchBrowsePanel, HeaderSearchSuggestionsPanel } from './HeaderSearchDropdownPanels'
import { useHeaderSearchDropdown } from './useHeaderSearchDropdown'

export interface HeaderSearchDropdownProps {
  popularTerms: string[]
}

export const HeaderSearchDropdown: React.FC<HeaderSearchDropdownProps> = ({ popularTerms }) => {
  const s = useHeaderSearchDropdown()

  return (
    <div ref={s.rootRef} className="relative min-w-0 max-w-2xl flex-1">
      <form
        onSubmit={s.onSubmit}
        role="search"
        className="relative flex items-center overflow-hidden rounded-full bg-white shadow-sm ring-2 ring-transparent transition-shadow focus-within:ring-primary-400 focus-within:ring-offset-2 focus-within:ring-offset-primary-600"
      >
        <input
          type="search"
          name="q"
          role="combobox"
          autoComplete="off"
          value={s.query}
          onChange={(e) => s.setQuery(e.target.value)}
          onFocus={() => s.setOpen(true)}
          placeholder={s.t('headerSearch.placeholder')}
          aria-label={s.t('headerSearch.ariaLabel')}
          aria-expanded={s.open}
          aria-controls={s.panelId}
          aria-autocomplete="list"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 pl-5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
        />
        {s.query ? (
          <button
            type="button"
            onClick={s.clearQuery}
            className="mr-0.5 shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={s.t('headerSearch.clearInput')}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : null}
        <div className="flex shrink-0 items-center gap-0.5 pr-1.5">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full p-2 text-gray-400 opacity-50"
            aria-disabled="true"
            title={s.t('headerSearch.voiceDisabled')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full p-2 text-gray-400 opacity-50"
            aria-disabled="true"
            title={s.t('headerSearch.scanDisabled')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </button>
          <button
            type="submit"
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
            aria-label={s.t('headerSearch.submitAria')}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {s.open ? (
        <div
          id={s.panelId}
          role="region"
          aria-label={s.t('headerSearch.panelAria')}
          className="scrollbar-subtle absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[45] max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain rounded-xl border border-gray-100/90 bg-white text-gray-900 shadow-2xl ring-1 ring-black/5 [scrollbar-gutter:stable]"
        >
          {s.isSearchMode ? (
            <HeaderSearchSuggestionsPanel
              suggestionsLabel={s.t('headerSearch.suggestions')}
              noResultsLabel={s.t('headerSearch.noResults')}
              viewAllLabel={s.t('headerSearch.viewAll')}
              suggestionItems={s.suggestionItems}
              showSkeleton={s.showSuggestSkeleton}
              suggestEmpty={s.suggestEmpty}
              consultLabel={s.consultLabel}
              onSelectProduct={s.onSelectProduct}
              onViewAll={() => s.navigateSearch(s.query)}
            />
          ) : (
            <HeaderSearchBrowsePanel
              historyLabel={s.t('headerSearch.history')}
              clearHistoryLabel={s.t('headerSearch.clearHistory')}
              removeItemAriaLabel={s.t('headerSearch.removeItem')}
              popularLabel={s.t('headerSearch.popular')}
              hotLabel={s.t('headerSearch.hot')}
              dealsLabel={s.t('headerSearch.deals')}
              history={s.history}
              popularTerms={popularTerms}
              hotProducts={s.hotProducts}
              dealProducts={s.dealProducts}
              hotPending={s.hotPending}
              dealsPending={s.dealsPending}
              consultLabel={s.consultLabel}
              onHistorySelect={(term) => {
                s.setQuery(term)
                s.navigateSearch(term)
              }}
              onPopularSelect={(term) => {
                s.setQuery(term)
                s.navigateSearch(term)
              }}
              onRemoveHistory={s.removeHistoryItem}
              onClearHistory={s.clearHistory}
              onMiniNavigate={s.closePanel}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}

export default HeaderSearchDropdown
