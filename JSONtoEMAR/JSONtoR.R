# install.packages("jsonlite")
# install.packages("plyr")
# install.packages("Rcpp")
# install.packages("gtools")
library(Rcpp)
library(jsonlite)
library(plyr)      
library(gtools) 



# comment this out and write your own file path if applicable
file = "/Users/addie/Desktop/EMAR/emotional-clarity-export.json"



# This function creates a csv file of the responses of all users
# from the JSON file. 
json_to_df <- function(file) {
  # create an empty dataframe with a User column
  User <- NA
  df <- data.frame(User)
  # in the JSON file
  json <- fromJSON(txt = file)
  # in 'apps'
  apps = json$`app-responses`
  # get a list of all times people did the thing
  names = names(apps)
  # for each index in list
  
  for (i in 1:length(names)) {
    # get the user
    name <- names[i]
    # get their nested dictionary
    user <- apps[name]
    # make it a dataframe
    user_df <- as.data.frame(user)
    
    # make the row name the ID of the user
    row.names(user_df) <- name

    # get column names
    columns <- colnames(user_df)
    # rename columns
    for(j in 1:length(columns)) {
      # split column name into a list by '.'
      words <- strsplit(columns[j], ".", fixed = TRUE)
      words2 <- words[[1]]
      # keep the good part of the variable
      words3 <- words2[3:length(words2)]
      # glue the column name back together
      words4 <- paste(words3, collapse='.' )
      # if the column is not null
      if(words4 != "") {
        # rename the column
        colnames(user_df)[j] <- words4
      } else {
        colnames(user_df)[j] <- "NA"
      }
    }
    # add the row to the total dataframe
    df <- rbind.fill(df, user_df)
    df[[i, "User"]] <- name
  }

  # take off last row (this is a redundancy to get the User column)
  final_df <- df[1:(nrow(df) - 1), ]
  View(final_df)
  # write csv
  write.csv(final_df, "/Users/addie/Desktop/EMAR/responses_from_json.csv")
}




# run this code
json_to_df(file)
