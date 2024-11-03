# Basic-Web-Load-Testing-Report

I’ve completed performance test on frequently used API for https://www.echotex.com/. 
Test executed for the below mentioned scenario in server 000.000.000.00. 

50 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 4.167 And Total Concurrent API requested: 200.
75 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 6.250 And Total Concurrent API requested: 300.
80 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 6.667 And Total Concurrent API requested: 320.
81 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 5.3 And Total Concurrent API requested: 324.   

While executed 81 concurrent request, found  81 request got connection timeout and error rate is 0.31%. 

Summary: Server can handle almost concurrent 322 API call with almost zero (0) error rate.

Please find the details report from the attachment.
