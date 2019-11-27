
// rules that should be used to configure read/write capabilities in firebase console
// See "Rules" tab at https://console.firebase.google.com/u/0/project/emotional-clarity/database/emotional-clarity/data

{
    "rules": {
        "measures": {
            "$user_id" : {
                ".write": "$user_id === auth.uid",
                ".read": "$user_id === auth.uid",
            },
        },
        "events": {
            "$user_id" : {
                ".write": "$user_id === auth.uid",
                ".read": "$user_id === auth.uid",
            },
        },
        "app-responses": {
            "$user_id" : {
                ".write": "$user_id === auth.uid",
                ".read": "$user_id === auth.uid",
            },
        },
    }
}
