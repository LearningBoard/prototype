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
