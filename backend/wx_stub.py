"""
wx stub — lets wx-importing service files load without wxPython installed.

Installed into sys.modules['wx'] at backend startup (see api/main.py) before
any service/ import happens.  Only the symbols actually used by the service
layer are implemented; everything else is a no-op.

Desktop usage          →  Mobile replacement
──────────────────────────────────────────────
wx.GetTranslation(s)   →  identity (English-only for v1)
wx.CallAfter(fn, *a)   →  fn(*a) directly (safe from executor threads)
wx.CommandProcessor    →  simple list-based stub (undo/redo not needed on mobile)
wx.PostEvent           →  no-op (no GUI event loop)
"""

import sys
from logbook import Logger

pyfalog = Logger(__name__)


def GetTranslation(s: str) -> str:
    """Identity function — mobile ships English-only for v1."""
    return s


def CallAfter(fn, *args, **kwargs):
    """
    In wxPython this defers fn to the GUI thread.  In the mobile backend
    there is no GUI thread; we call fn directly.  All call sites in
    service/ invoke this from background threads which is safe under
    uvicorn's thread-executor model.
    """
    try:
        fn(*args, **kwargs)
    except Exception as exc:
        pyfalog.error("wx.CallAfter stub: error calling {0}: {1}", fn, exc)


def PostEvent(window, event):
    """No-op — no wx event loop in the mobile backend."""
    pass


class CommandProcessor:
    """
    Minimal undo/redo stub.  service/fit.py stores one per fit for the
    desktop undo history.  Mobile doesn't expose undo/redo, so we just
    execute commands immediately and discard history.
    """

    def __init__(self, maxCommands: int = 100):
        self._maxCommands = maxCommands

    def Submit(self, command, storeIt: bool = True) -> bool:
        try:
            return bool(command.Do())
        except Exception as exc:
            pyfalog.error("CommandProcessor.Submit: {0}", exc)
            return False

    def Undo(self) -> bool:
        return False

    def Redo(self) -> bool:
        return False

    def CanUndo(self) -> bool:
        return False

    def CanRedo(self) -> bool:
        return False

    def ClearCommands(self):
        pass

    def GetCommands(self):
        return []


# ---------------------------------------------------------------------------
# Module-level aliases that service files bind at import time
#   e.g.  _t = wx.GetTranslation
# ---------------------------------------------------------------------------

# Locale stub — keeps wx.Locale.FindLanguageInfo from blowing up if called
class _LocaleStub:
    @staticmethod
    def FindLanguageInfo(lang):
        return None


class _TranslationsStub:
    @staticmethod
    def Get():
        return _TranslationsStub()

    @staticmethod
    def GetAvailableTranslations(catalog):
        return []


Locale = _LocaleStub
Translations = _TranslationsStub


def install():
    """
    Install this module as 'wx' in sys.modules.
    Must be called before any service/ import.
    """
    if 'wx' not in sys.modules:
        sys.modules['wx'] = sys.modules[__name__]
        pyfalog.debug("wx stub installed")
    else:
        pyfalog.debug("wx already in sys.modules — stub not installed")
