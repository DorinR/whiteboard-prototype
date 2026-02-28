### data store
The data for a given whiteboard was stored in a global store. This makes it easier to manage local persistence (to localstorage) and makes it easier to periodically persist the board to the server. Individual notes receive their state and memoize it so that when the gloabl store is updated, only the affected notes are re-rendered.

### updating note locations
The requestAnimationFrame api was used to avoid needless computations. It enables us to limit recalculation of a note's position such that it does not exceed the refresh rate of the screen we are viewing the board on. If you're on a 60hz screen, there won't be more than 60 updates per second, which avoid needless computations. 

### 2 contexts
The dispatch and the notesStore were passed down through 2 separate context so that components that only need to dispatch do not have to subscribe to the changes to the board's store. For example the ResizeComponent never re-renders when the global store is updated.