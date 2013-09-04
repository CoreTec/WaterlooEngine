sprite example
{
	name: 'HumanArcher',
	imageDefaults:{
		imagesrc: 'humanarcher.gif',
		cellWidth: 30,
		cellHeight: 42
	},
	stateDefaults:{
	},
	bindingPoints:{
		0: 'head',
		1: 'lhand',
		2: 'rhand',
		3: 'legs',
		4: 'body'
	},
	states:{
		'idle':{
			animation:{
				frames: [
					{
						imageId:0,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [x:25, y:26, rotation: 10],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:1,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:2,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:3,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:4,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					}
				],
				delay: 10
			},
			notifications: [],
			nextState:{
				'idle': {
					chance: 5
				},
				'dummy1': {
					chance: 1
				},
				'dummy2': {
					chance: 1
				},
				'dummy3': {
					chance: 1
				}
			}
		},
		'moving':{
			animation:{
				frames: [
					{
						imageId:0,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:1,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:2,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:3,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					},
					{
						imageId:4,
						binding:{
							0: [15,5],
							1: {x:5, y:26},
							2: [25,26],
							3: [15,38],
							4: [15,20]
						}
					}
				],
				delay: 10
			},
			notifications: ['step','after'],
			loop: true
		}
	}
}
