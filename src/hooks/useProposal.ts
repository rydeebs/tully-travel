import { useReducer } from "react";
import type { Day, Proposal, Stay } from "../shared/proposal";

export type BusyKey = "all" | "intro" | "stays" | "accessTouches" | `day-${number}`;

export type ProposalState = {
  proposal: Proposal | null;
  busy: BusyKey[];
  errors: Record<string, string>;
};

type IntroPiece = {
  title: string;
  overview: string;
};

type Action =
  | { type: "set"; proposal: Proposal }
  | { type: "editTitle"; value: string }
  | { type: "editOverview"; value: string }
  | { type: "editDayField"; index: number; field: "title" | "narrative"; value: string }
  | { type: "editHighlight"; dayIndex: number; highlightIndex: number; value: string }
  | { type: "editStay"; index: number; field: "suggestion" | "location"; value: string }
  | { type: "editTouch"; index: number; value: string }
  | { type: "replaceDay"; index: number; day: Day }
  | { type: "replaceIntro"; intro: IntroPiece }
  | { type: "replaceStays"; stays: Stay[] }
  | { type: "replaceTouches"; touches: string[] }
  | { type: "setBusy"; key: BusyKey; busy: boolean }
  | { type: "setError"; key: BusyKey; message: string | null };

const initialState: ProposalState = {
  proposal: null,
  busy: [],
  errors: {},
};

export function useProposal() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    ...state,
    setProposal: (proposal: Proposal) => dispatch({ type: "set", proposal }),
    editTitle: (value: string) => dispatch({ type: "editTitle", value }),
    editOverview: (value: string) => dispatch({ type: "editOverview", value }),
    editDayField: (index: number, field: "title" | "narrative", value: string) =>
      dispatch({ type: "editDayField", index, field, value }),
    editHighlight: (dayIndex: number, highlightIndex: number, value: string) =>
      dispatch({ type: "editHighlight", dayIndex, highlightIndex, value }),
    editStay: (index: number, field: "suggestion" | "location", value: string) =>
      dispatch({ type: "editStay", index, field, value }),
    editTouch: (index: number, value: string) => dispatch({ type: "editTouch", index, value }),
    replaceDay: (index: number, day: Day) => dispatch({ type: "replaceDay", index, day }),
    replaceIntro: (intro: IntroPiece) => dispatch({ type: "replaceIntro", intro }),
    replaceStays: (stays: Stay[]) => dispatch({ type: "replaceStays", stays }),
    replaceTouches: (touches: string[]) => dispatch({ type: "replaceTouches", touches }),
    setBusy: (key: BusyKey, busy: boolean) => dispatch({ type: "setBusy", key, busy }),
    setError: (key: BusyKey, message: string | null) =>
      dispatch({ type: "setError", key, message }),
  };
}

export type ProposalActions = Omit<ReturnType<typeof useProposal>, keyof ProposalState>;

function reducer(state: ProposalState, action: Action): ProposalState {
  switch (action.type) {
    case "set":
      return { ...state, proposal: action.proposal, errors: {} };
    case "editTitle":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        title: required(action.value, proposal.title),
      }));
    case "editOverview":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        overview: required(action.value, proposal.overview),
      }));
    case "editDayField":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        days: proposal.days.map((day, index) =>
          index === action.index
            ? { ...day, [action.field]: required(action.value, day[action.field]) }
            : day,
        ),
      }));
    case "editHighlight":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        days: proposal.days.map((day, index) =>
          index === action.dayIndex
            ? {
                ...day,
                highlights: updateOptionalList(
                  day.highlights,
                  action.highlightIndex,
                  action.value,
                ),
              }
            : day,
        ),
      }));
    case "editStay":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        stays: proposal.stays.map((stay, index) =>
          index === action.index
            ? { ...stay, [action.field]: required(action.value, stay[action.field]) }
            : stay,
        ),
      }));
    case "editTouch":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        accessTouches: updateOptionalList(proposal.accessTouches, action.index, action.value),
      }));
    case "replaceDay":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        days: proposal.days.map((day, index) => (index === action.index ? action.day : day)),
      }));
    case "replaceIntro":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        title: required(action.intro.title, proposal.title),
        overview: required(action.intro.overview, proposal.overview),
      }));
    case "replaceStays":
      return updateProposal(state, (proposal) => ({ ...proposal, stays: action.stays }));
    case "replaceTouches":
      return updateProposal(state, (proposal) => ({
        ...proposal,
        accessTouches: action.touches,
      }));
    case "setBusy":
      return { ...state, busy: updateBusy(state.busy, action.key, action.busy) };
    case "setError":
      return { ...state, errors: updateError(state.errors, action.key, action.message) };
    default:
      return state;
  }
}

function updateProposal(
  state: ProposalState,
  updater: (proposal: Proposal) => Proposal,
): ProposalState {
  if (state.proposal === null) {
    return state;
  }

  return { ...state, proposal: updater(state.proposal) };
}

function required(value: string, previous: string): string {
  const next = value.trim();
  return next.length > 0 ? next : previous;
}

function updateOptionalList(items: string[], index: number, value: string): string[] {
  const next = value.trim();

  if (next.length === 0) {
    return items.filter((_item, itemIndex) => itemIndex !== index);
  }

  return items.map((item, itemIndex) => (itemIndex === index ? next : item));
}

function updateBusy(busy: BusyKey[], key: BusyKey, isBusy: boolean): BusyKey[] {
  if (isBusy) {
    return busy.includes(key) ? busy : [...busy, key];
  }

  return busy.filter((item) => item !== key);
}

function updateError(
  errors: Record<string, string>,
  key: BusyKey,
  message: string | null,
): Record<string, string> {
  const next = { ...errors };

  if (message === null) {
    delete next[key];
    return next;
  }

  next[key] = message;
  return next;
}
