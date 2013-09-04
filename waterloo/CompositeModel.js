example of usage

{
	name: 'playerBody',
	//just for readability
	//this will be anyway recalculated based on bindingTree property
	endpoints:{
		0: 'head',
		1: 'body',
		2: 'legs',
		3: 'lhand',
		4: 'rhand',
		5: 'pants'
	},
	bindingTree:{
		'upperPart':['head','body','lhand','rhand'],
		'lowerPart':['legs','pants']
	}
}