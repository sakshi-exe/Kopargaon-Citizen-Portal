import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import Header from '../../components/ui/Header.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
} from '../../data/issues.js';
import {
  formatDate,
  getRelativeTime,
} from '../../utils/formatters.js';

import {
  computeIssuePriority,
} from '../../utils/issuePriority.js';

import {
  Search,
  MapPin,
  CheckCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';


// ==================================================
// STATUS FLOW
// ==================================================

const STATUS_FLOW = {
  Reported: {
    next: 'Under Review',
  },

  'Under Review': {
    next: 'Assigned',
  },

  Assigned: {
    next: 'In Progress',
  },

  'In Progress': {
    next: 'Resolved',
  },

  Resolved: {
    next: 'Verified',
  },

  Verified: {
    next: null,
  },

  Closed: {
    next: null,
  },
};


// ==================================================
// NORMALIZE STATUS
// ==================================================

const normalizeStatus = (status) => {
  if (!status) {
    return 'Reported';
  }

  const value = String(status).toLowerCase();

  if (value === 'pending') {
    return 'Reported';
  }

  if (value === 'under_review') {
    return 'Under Review';
  }

  if (value === 'in_progress') {
    return 'In Progress';
  }

  if (value === 'reported') {
    return 'Reported';
  }

  if (value === 'assigned') {
    return 'Assigned';
  }

  if (value === 'resolved') {
    return 'Resolved';
  }

  if (value === 'verified') {
    return 'Verified';
  }

  if (value === 'closed') {
    return 'Closed';
  }

  return status;
};


// ==================================================
// MAP SUPABASE ISSUE → UI ISSUE
// ==================================================

const mapSupabaseIssue = (issue) => ({
  ...issue,

  citizenName:
    issue.citizen_name || 'Citizen',

  submittedDate: issue.created_at
    ? new Date(issue.created_at)
    : new Date(),

  /*
   * IMPORTANT:
   * Your current issues table does NOT have
   * updated_at.
   *
   * Therefore we use created_at as the fallback.
   */
  updatedDate: issue.created_at
    ? new Date(issue.created_at)
    : new Date(),

  lat: issue.latitude,
  lng: issue.longitude,

  wardId:
    issue.location || 'Unknown Ward',

  isAnonymous:
    !issue.citizen_name ||
    String(issue.citizen_name).toLowerCase() ===
      'anonymous',

  displayStatus:
    normalizeStatus(issue.status),
});


// ==================================================
// COMPONENT
// ==================================================

export default function AdminCitizenIssues() {

  const [issues, setIssues] = useState([]);

  const [search, setSearch] =
    useState('');

  const [filterStatus, setFilterStatus] =
    useState('All');

  const [filterWard, setFilterWard] =
    useState('All');

  const [filterCat, setFilterCat] =
    useState('All');

  const [selected, setSelected] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [updatingId, setUpdatingId] =
    useState(null);


  // ==================================================
  // FETCH ISSUES
  // ==================================================

  const fetchIssues = async () => {

    setLoading(true);
    setError(null);

    try {

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', {
          ascending: false,
        });


      if (supabaseError) {

        console.error(
          'Supabase Admin Issues Error:',
          supabaseError
        );

        throw supabaseError;
      }


      // ==================================================
      // REAL SUPABASE DATA → PRIORITY ENGINE
      // ==================================================

      const mappedIssues =
        (data || [])
          .map(mapSupabaseIssue)
          .map((issue) => ({
            ...issue,

            /*
             * Priority is calculated from the
             * actual citizen complaint.
             *
             * No static issue data is used here.
             */
            aiPriority:
              computeIssuePriority(issue),
          }));


      setIssues(mappedIssues);

    } catch (err) {

      console.error(
        'Admin Issues Error:',
        err
      );

      setError(
        err?.message ||
          'Unable to load citizen complaints.'
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchIssues();
  }, []);


  // ==================================================
  // FILTER OPTIONS
  // ==================================================

  const wardOptions = [
    ...new Set(
      issues
        .map(
          (issue) =>
            issue.location
        )
        .filter(Boolean)
    ),
  ];


  const categoryOptions =
    ISSUE_CATEGORIES.length > 0
      ? ISSUE_CATEGORIES
      : [
          ...new Set(
            issues
              .map(
                (issue) =>
                  issue.category
              )
              .filter(Boolean)
          ),
        ];


  // ==================================================
  // FILTERED ISSUES
  // ==================================================

  const filtered =
    issues.filter((issue) => {

      const description =
        issue.description || '';

      const category =
        issue.category || '';

      const id =
        String(issue.id || '');

      const citizen =
        issue.citizenName || '';

      const location =
        issue.location || '';

      const searchValue =
        search.toLowerCase();


      const matchSearch =
        !search ||

        description
          .toLowerCase()
          .includes(searchValue) ||

        category
          .toLowerCase()
          .includes(searchValue) ||

        id
          .toLowerCase()
          .includes(searchValue) ||

        citizen
          .toLowerCase()
          .includes(searchValue) ||

        location
          .toLowerCase()
          .includes(searchValue);


      const matchStatus =
        filterStatus === 'All' ||
        issue.displayStatus ===
          filterStatus;


      const matchWard =
        filterWard === 'All' ||
        issue.location ===
          filterWard;


      const matchCat =
        filterCat === 'All' ||
        issue.category ===
          filterCat;


      return (
        matchSearch &&
        matchStatus &&
        matchWard &&
        matchCat
      );

    });


  // ==================================================
  // ADVANCE STATUS
  // ==================================================

  const advanceStatus = async (
    issueId,
    currentStatus
  ) => {

    const next =
      STATUS_FLOW[
        currentStatus
      ]?.next;


    if (!next) {
      return;
    }


    setUpdatingId(issueId);


    try {

      /*
       * IMPORTANT FIX:
       *
       * Do NOT use:
       * .select()
       * .single()
       *
       * We only need to update the row.
       *
       * Also do NOT send updated_at because
       * that column does not exist in your table.
       */

      const {
        error: updateError,
      } = await supabase
        .from('issues')
        .update({
          status: next,
        })
        .eq('id', issueId);


      if (updateError) {

        console.error(
          'Supabase Status Update Error:',
          updateError
        );

        alert(
          `Failed to update status:\n\n${updateError.message}`
        );

        return;
      }


      // ==================================================
      // UPDATE TABLE UI
      // ==================================================

      setIssues(
        (currentIssues) =>
          currentIssues.map(
            (issue) =>
              issue.id === issueId
                ? {
                    ...issue,

                    status: next,

                    displayStatus: next,

                    /*
                     * UI-only timestamp.
                     * Database does not have updated_at.
                     */
                    updatedDate:
                      new Date(),
                  }
                : issue
          )
      );


      // ==================================================
      // UPDATE OPEN MODAL
      // ==================================================

      setSelected(
        (currentSelected) => {

          if (
            !currentSelected ||
            currentSelected.id !==
              issueId
          ) {
            return currentSelected;
          }


          return {
            ...currentSelected,

            status: next,

            displayStatus: next,

            updatedDate:
              new Date(),
          };

        }
      );


      console.log(
        `Issue ${issueId} updated to ${next}`
      );


    } catch (err) {

      console.error(
        'Unexpected status update error:',
        err
      );

      alert(
        `Something went wrong while updating the status:\n\n${
          err?.message || 'Unknown error'
        }`
      );

    } finally {

      setUpdatingId(null);

    }
  };


  // ==================================================
  // COUNTS
  // ==================================================

  const unresolvedCount =
    issues.filter(
      (issue) =>
        ![
          'Resolved',
          'Verified',
          'Closed',
        ].includes(
          issue.displayStatus
        )
    ).length;


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="flex flex-col h-full overflow-hidden">

        <Header
          title="Kopargaon Citizen Issues Triage"
          subtitle="Loading complaints from Supabase..."
        />

        <div className="flex-1 flex items-center justify-center">

          <div className="text-center">

            <RefreshCw
              size={30}
              className="mx-auto mb-3 text-blue-500 animate-spin"
            />

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading citizen complaints...
            </p>

          </div>

        </div>

      </div>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (
      <div className="flex flex-col h-full overflow-hidden">

        <Header
          title="Kopargaon Citizen Issues Triage"
          subtitle="Unable to load complaints"
        />

        <div className="flex-1 flex items-center justify-center">

          <div className="text-center max-w-md px-6">

            <AlertCircle
              size={42}
              className="mx-auto mb-3 text-red-500"
            />

            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
              Failed to load issues
            </h3>

            <p className="text-sm text-red-500 mb-4">
              {error}
            </p>

            <button
              onClick={fetchIssues}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold"
            >

              <RefreshCw size={14} />

              Try Again

            </button>

          </div>

        </div>

      </div>
    );
  }


  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="flex flex-col h-full overflow-hidden">

      <Header
        title="Kopargaon Citizen Issues Triage"
        subtitle={`${filtered.length} complaints shown · ${unresolvedCount} active unresolved in Kopargaon wards`}
      />


      {/* ==================================================
          FILTER BAR
      ================================================== */}

      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search complaint..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
            />

          </div>


          {/* STATUS */}

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value
              )
            }
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none"
          >

            <option value="All">
              All Statuses
            </option>

            {ISSUE_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}

          </select>


          {/* CATEGORY */}

          <select
            value={filterCat}
            onChange={(e) =>
              setFilterCat(
                e.target.value
              )
            }
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none"
          >

            <option value="All">
              All Categories
            </option>

            {categoryOptions.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>


          {/* WARD */}

          <select
            value={filterWard}
            onChange={(e) =>
              setFilterWard(
                e.target.value
              )
            }
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none"
          >

            <option value="All">
              All Kopargaon Wards
            </option>

            {wardOptions.map(
              (ward) => (
                <option
                  key={ward}
                  value={ward}
                >
                  {ward}
                </option>
              )
            )}

          </select>

        </div>

      </div>


      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="flex-1 overflow-auto">

        <table className="w-full text-left">

          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">

            <tr>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Complaint ID
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Category
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Ward / Area
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Description
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Reported By
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Timeline
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Workflow Action
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">

            {filtered.map(
              (issue) => {

                const status =
                  issue.displayStatus;

                const next =
                  STATUS_FLOW[
                    status
                  ]?.next;


                return (
                  <tr
                    key={issue.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >

                    {/* ID */}

                    <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">

                      {issue.id}

                    </td>


                    {/* CATEGORY */}

                    <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">

                      {issue.category}

                    </td>


                    {/* WARD */}

                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">

                      {issue.location ||
                        'Unknown'}

                    </td>


                    {/* DESCRIPTION */}

                    <td className="px-4 py-3.5 max-w-[240px]">

                      <span className="line-clamp-2 text-slate-700 dark:text-slate-300 leading-snug">

                        {issue.description}

                      </span>

                    </td>


                    {/* CITIZEN */}

                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">

                      {issue.isAnonymous
                        ? 'Anonymous'
                        : issue.citizenName}

                    </td>


                    {/* TIMELINE */}

                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">

                      {issue.submittedDate
                        ? getRelativeTime(
                            issue.submittedDate
                          )
                        : '—'}

                    </td>


                    {/* STATUS */}

                    <td className="px-4 py-3.5 whitespace-nowrap">

                      <StatusBadge
                        status={
                          status
                        }
                      />

                    </td>


                    {/* ACTION */}

                    <td className="px-4 py-3.5 whitespace-nowrap">

                      <div className="flex gap-2 items-center">

                        <button
                          onClick={() =>
                            setSelected(
                              issue
                            )
                          }
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          View
                        </button>


                        {next && (

                          <button
                            disabled={
                              updatingId ===
                              issue.id
                            }
                            onClick={() =>
                              advanceStatus(
                                issue.id,
                                status
                              )
                            }
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold whitespace-nowrap disabled:opacity-50"
                          >

                            {updatingId ===
                            issue.id
                              ? 'Updating...'
                              : `→ ${next}`}

                          </button>

                        )}

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>


        {/* EMPTY FILTER */}

        {filtered.length === 0 && (

          <div className="py-16 text-center">

            <Search
              size={32}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="text-sm text-slate-500 dark:text-slate-400">
              No complaints match your filters.
            </p>

          </div>

        )}

      </div>


      {/* ==================================================
          MODAL
      ================================================== */}

      <Modal
        isOpen={!!selected}
        onClose={() =>
          setSelected(null)
        }
        title={`Citizen Complaint ${
          selected?.id || ''
        }`}
        size="md"
      >

        {selected && (

          <div className="space-y-4 text-xs">


            {/* DETAILS GRID */}

            <div className="grid grid-cols-2 gap-3">

              {[
                [
                  'Complaint ID',
                  selected.id,
                ],

                [
                  'Category',
                  selected.category,
                ],

                [
                  'Ward / Location',
                  selected.location ||
                    'Unknown',
                ],

                [
                  'Reported Date',
                  selected.submittedDate
                    ? formatDate(
                        selected.submittedDate
                      )
                    : '—',
                ],

                [
                  'Last Updated',
                  selected.updatedDate
                    ? formatDate(
                        selected.updatedDate
                      )
                    : '—',
                ],

                [
                  'Citizen Reporter',
                  selected.isAnonymous
                    ? 'Anonymous'
                    : selected.citizenName ||
                      'Citizen',
                ],

                [
                  'GPS Coordinates',
                  selected.latitude !=
                    null &&
                  selected.longitude !=
                    null
                    ? `${Number(
                        selected.latitude
                      ).toFixed(
                        5
                      )}, ${Number(
                        selected.longitude
                      ).toFixed(5)}`
                    : 'Not available',
                ],

                [
                  'Linked Asset ID',
                  selected.linked_asset_id ||
                    'General Area',
                ],
              ].map(
                ([key, value]) => (

                  <div
                    key={key}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                  >

                    <div className="text-[10px] text-slate-400 font-medium">
                      {key}
                    </div>

                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 break-words">
                      {value}
                    </div>

                  </div>

                )
              )}

            </div>


            {/* LOCATION */}

            {selected.latitude !=
              null &&
              selected.longitude !=
                null && (

              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">

                <MapPin
                  size={15}
                  className="text-blue-500"
                />

                <div>

                  <div className="text-[10px] text-blue-500 font-semibold uppercase">
                    Field Coordinates
                  </div>

                  <div className="font-mono text-blue-700 dark:text-blue-300">

                    {Number(
                      selected.latitude
                    ).toFixed(6)}

                    ,{' '}

                    {Number(
                      selected.longitude
                    ).toFixed(6)}

                  </div>

                </div>

              </div>

            )}


            {/* DESCRIPTION */}

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">

              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Issue Description
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                {selected.description}
              </p>

            </div>


            {/* STATUS */}

            <div className="flex items-center justify-between pt-2">

              <div className="flex items-center gap-2">

                <span className="text-slate-500 font-medium">
                  Status:
                </span>

                <StatusBadge
                  status={
                    selected.displayStatus
                  }
                />

              </div>


              {STATUS_FLOW[
                selected.displayStatus
              ]?.next && (

                <button
                  disabled={
                    updatingId ===
                    selected.id
                  }
                  onClick={() =>
                    advanceStatus(
                      selected.id,
                      selected.displayStatus
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
                >

                  <CheckCircle
                    size={14}
                  />

                  {updatingId ===
                  selected.id
                    ? 'Updating...'
                    : `Advance to ${
                        STATUS_FLOW[
                          selected
                            .displayStatus
                        ].next
                      }`}

                </button>

              )}

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}