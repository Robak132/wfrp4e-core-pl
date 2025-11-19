import fnmatch

def path_matches(path, patterns):
    """True if path matches ANY wildcard in patterns."""
    # Support patterns that end with ".*" to also match the base path without the trailing
    # ".*" segment. This allows blacklist entries like "*.encumbrance.*" to remove the
    # entire "encumbrance" object even when it's a scalar (no child keys).
    for p in patterns:
        # Direct match first
        if fnmatch.fnmatch(path, p):
            return True

        # If the pattern targets the children of a path (trailing ".*"), also treat the
        # parent path itself as a match so we can drop the whole subtree when needed.
        if p.endswith(".*"):
            base = p[:-2]
            if fnmatch.fnmatch(path, base):
                return True

    return False

def should_keep(path, whitelist, blacklist):
    """Determine whether a path is allowed."""
    if whitelist and not path_matches(path, whitelist):
        return False
    if blacklist and path_matches(path, blacklist):
        return False
    return True

def cleanup(value):
    """Remove empty dicts/lists. Returns None for empty."""
    if value == {} or value == [] or value == "":
        return None
    return value

def filter_dict(data, whitelist, blacklist, path, paths, filter_fn):
    new_obj = {}
    for key, value in data.items():
        new_path = f"{path}.{key}" if path else key
        filtered, paths = filter_fn(value, whitelist, blacklist, new_path, paths)
        filtered = cleanup(filtered)

        # Keep this entry if it's explicitly allowed, OR if it contains non-empty nested data
        # (i.e., a non-empty dict/list that still has allowed descendants). Do not keep
        # disallowed scalar values.
        if should_keep(new_path, whitelist, blacklist) or (
            filtered is not None and isinstance(filtered, (dict, list))
        ):
            if filtered is not None:
                new_obj[key] = filtered

    return cleanup(new_obj), paths

def filter_list(data, whitelist, blacklist, path, paths, filter_fn):
    new_list = []
    for idx, item in enumerate(data):
        new_path = f"{path}[{idx}]"
        filtered, paths = filter_fn(item, whitelist, blacklist, new_path, paths)
        filtered = cleanup(filtered)

        # Keep this list item if it's explicitly allowed, OR if it contains non-empty nested data
        # (i.e., a non-empty dict/list that still has allowed descendants). Do not keep
        # disallowed scalar values.
        if should_keep(new_path, whitelist, blacklist) or (
            filtered is not None and isinstance(filtered, (dict, list))
        ):
            if filtered is not None:
                new_list.append(filtered)

    return cleanup(new_list), paths

def filter_json(data, whitelist=None, blacklist=None, path="", paths=None):
    """
    Filter JSON using wildcard whitelist/blacklist AND
    automatically remove empty dicts/lists.

    Returns:
        (filtered_json, all_paths)
    """
    if paths is None:
        paths = []

    whitelist = whitelist or []
    blacklist = blacklist or []

    if path:
        paths.append(path)

    if not isinstance(data, (dict, list)):
        return data, paths

    filter_fn = lambda v, w, b, p, ps: filter_json(v, w, b, p, ps)

    if isinstance(data, dict):
        return filter_dict(data, whitelist, blacklist, path, paths, filter_fn)

    return filter_list(data, whitelist, blacklist, path, paths, filter_fn)

import json
import re

json_data = json.load(open("compendium-en/wfrp4e-soc.items.json", "r", encoding="utf-8"))

filtered, all_paths = filter_json(
    json_data,
    blacklist=["*.encumbrance.*", "*.quantity.*", "*.price.*", "*.qualities.*", "*.flaws.*", "*.label", "*.type.*",
               "*.availability.*", "*.trappingType.*", "*.worn.*", "*.handling.*", "*.prompt.*", "*.usage.duration.*",
               "*.usage.establish.*", "*.ammunitionGroup.*",  "*.weaponGroup.*", "*.twohanded.*", "*.modifiesSkills.*",
               "*.mutationType.*", "*.ammunitionType.*", "*.system.damage.*", "*.system.overcast.*", "*.extendable.*",
               "*.currentAmmo.*", "*.equipped.*", "*.offhand.*", "*.consumesAmmo.*", "*.advances.*", "*.max.*", "*.rollable.*",
               "*.disabled.*", "*.category.*"]
)
json.dump(filtered, open("compendium-en/wfrp4e-soc.items.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)

print("\nAll object paths:")
for p in all_paths:
    print(p)