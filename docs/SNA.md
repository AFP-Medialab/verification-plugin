## use case
### Scapping
-> Scrap Social Networkd -> Store indexDB

###  Upload Data
-> Upload Data -> Normalize data

Option -> store indexDB

### Datasource format
accountNameMap: Map
content: Array[]
headers: Array[]
id: string
lenght:
name: string
source: Enum -> fileUpload

(metrics)
### Process selected DataSet

#### Zeeschuimer data fromat njson

item_id: string
timestamp_collected: epoc_time
source_plateform: string
source_plateform_url : string
qource_url: string
user_agent: string
data: custom_object

#### Separate dataset selection



FB headers

0: "objects"
1: "Link"
2: "date"
3: "username"
4: "id"
5: "Page Name"
6: "User Name"
7: "Page Category"
8: "Page Admin Top Country"
9: "Page Description"
10: "Page Created"
11: "Likes at Posting"
12: "Followers at Posting"
13: "Post Created Date"
14: "Post Created Time"
15: "Type"
16: "Total Interactions"
17
: 
"Comments"
18
: 
"Shares"
19
: 
"Love"
20
: 
"Wow"
21
: 
"Haha"
22
: 
"Sad"
23
: 
"Angry"
24
: 
"Care"
25
: 
"Video Share Status"
26
: 
"Is Video Owner?"
27
: 
"Post Views"
28
: 
"Total Views"
29
: 
"Total Views For All Crossposts"
30
: 
"Video Length"
31
: 
"Final Link"
32
: 
"Image Text"
33
: 
"Link Text"
34
: 
"Description"
35
: 
"Sponsor Id"
36
: 
"Sponsor Name"
37
: 
"Sponsor Category"
38
: 
"Total Interactions (weighted  —  Likes 1x Shares 1x Comments 1x Love 1x Wow 1x Haha 1x Sad 1x Angry 1x Care 1x )"
39
: 
"Overperforming Score"
40
: 
"likes"
41
: 
"hashtags"
42
: 
"text"
