def get_or_None(obj, selected = None, prefetch = None, **kwargs):

    # selected:
    #   ForeignKeys, OneToOneFields

    # prefetched:

    #   Reverse_ForeignKeys, ManyToManyFields

    # It's a simple shortcut

    if selected is None:
        selected = [None]
    if prefetch is None:
        prefetch = [None]
    try:
        return obj._default_manager.select_related(*selected).prefetch_related(*prefetch).get(**kwargs)
    except obj.DoesNotExist:
        return None

def qdict_to_dict(qdict):
    """Convert a Django QueryDict to a Python dict.

    Single-value fields are put in directly, and for multi-value fields, a list
    of all values is stored at the field's key.

    """
    return {k: v[0] if len(v) == 1 else v for k, v in qdict.lists()}
