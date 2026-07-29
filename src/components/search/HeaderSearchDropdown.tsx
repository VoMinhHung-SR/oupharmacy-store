'use client'

import React from 'react'
import { SearchIcon, XCircleIcon, MicIcon, QrScanIcon } from '@/components/icons'
import { HeaderSearchBrowsePanel, HeaderSearchSuggestionsPanel } from './HeaderSearchDropdownPanels'
import { useHeaderSearchDropdown } from './useHeaderSearchDropdown'

export interface HeaderSearchDropdownProps {
  popularTerms: string[]
}

export const HeaderSearchDropdown: React.FC<HeaderSearchDropdownProps> = ({ popularTerms }) => {
  const s = useHeaderSearchDropdown()

  return (
    <div ref={s.rootRef} className="relative w-full min-w-0 lg:max-w-2xl">
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
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 pl-3.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none sm:px-4 sm:py-3 sm:pl-5"
        />
        {s.query ? (
          <button
            type="button"
            onClick={s.clearQuery}
            className="mr-0.5 shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:p-2"
            aria-label={s.t('headerSearch.clearInput')}
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        ) : null}
        <div className="flex shrink-0 items-center gap-0.5 pr-1 sm:pr-1.5">
          <button
            type="button"
            disabled
            className="hidden cursor-not-allowed rounded-full p-2 text-gray-400 opacity-50 sm:inline-flex"
            aria-disabled="true"
            title={s.t('headerSearch.voiceDisabled')}
          >
            <MicIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            disabled
            className="hidden cursor-not-allowed rounded-full p-2 text-gray-400 opacity-50 sm:inline-flex"
            aria-disabled="true"
            title={s.t('headerSearch.scanDisabled')}
          >
            <QrScanIcon className="h-5 w-5" />
          </button>
          <button
            type="submit"
            className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600 sm:p-2"
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
              suggestError={s.suggestError}
              suggestErrorLabel={s.t('headerSearch.suggestError')}
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
